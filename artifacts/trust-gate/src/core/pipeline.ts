import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@workspace/db";
import { validationEvidenceTable } from "@workspace/db/schema";
import type { ActionClaim, RecoveryClaim, PipelineContext, ValidationResponse, RuleResult, Confidence, Verdict } from "./types";
import { evaluateRules } from "./rule-engine";
import { logger } from "../lib/logger";

function normalizeInput(input: Record<string, unknown>): Record<string, unknown> {
  const sorted = Object.keys(input).sort().reduce<Record<string, unknown>>((acc, key) => {
    acc[key] = input[key];
    return acc;
  }, {});
  return sorted;
}

function computeInputHash(normalized: Record<string, unknown>): string {
  const json = JSON.stringify(normalized);
  return createHash("sha256").update(json).digest("hex");
}

type SignatureResult = { valid: true } | { valid: false; reason: string } | { valid: "skipped" };

function verifySignature(signature: string | undefined, inputHash: string): SignatureResult {
  const secret = process.env.TRUST_GATE_HMAC_SECRET;
  const enforceSignature = process.env.TRUST_GATE_REQUIRE_SIGNATURE !== "false";

  if (!secret) {
    if (enforceSignature) {
      return { valid: false, reason: "HMAC secret not configured — signature verification cannot be performed" };
    }
    return { valid: "skipped" };
  }

  if (!signature) {
    return { valid: false, reason: "No signature provided" };
  }

  const expected = createHmac("sha256", secret).update(inputHash).digest("hex");
  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) {
      return { valid: false, reason: "Signature length mismatch" };
    }
    if (timingSafeEqual(sigBuf, expBuf)) {
      return { valid: true };
    }
    return { valid: false, reason: "Signature verification failed" };
  } catch {
    return { valid: false, reason: "Signature format invalid" };
  }
}

function reconstructContext(claim: ActionClaim | RecoveryClaim, claimType: "action" | "recovery"): Record<string, unknown> {
  const context: Record<string, unknown> = {
    claimType,
    actionType: claim.actionType,
    systemId: claim.systemId,
    callerId: claim.callerId ?? null,
    claimTimestamp: claim.timestamp,
    evaluationTimestamp: new Date().toISOString(),
  };
  if (claimType === "recovery") {
    const recovery = claim as RecoveryClaim;
    context.hasBeforeState = !!recovery.beforeState;
    context.hasAfterState = !!recovery.afterState;
    context.beforeStateKeys = recovery.beforeState ? Object.keys(recovery.beforeState) : [];
    context.afterStateKeys = recovery.afterState ? Object.keys(recovery.afterState) : [];
  }
  return context;
}

function assessConfidence(ruleResults: RuleResult[], sigResult: SignatureResult): Confidence {
  const validCount = ruleResults.filter(r => r.status === "VALID").length;
  const totalEvaluated = ruleResults.length;
  if (totalEvaluated === 0) return "LOW";
  if (sigResult.valid === false) return "LOW";
  if (validCount > 1) return "HIGH";
  return "LOW";
}

function decide(ruleResults: RuleResult[], confidence: Confidence, sigResult: SignatureResult): { verdict: Verdict; reason: string } {
  if (sigResult.valid === false) {
    return { verdict: "REJECTED", reason: sigResult.reason };
  }

  const rejected = ruleResults.find(r => r.status === "REJECTED");
  if (rejected) {
    return { verdict: "REJECTED", reason: rejected.reason };
  }

  const hasUnknown = ruleResults.some(r => r.status === "UNKNOWN");
  if (hasUnknown) {
    const unknownRule = ruleResults.find(r => r.status === "UNKNOWN");
    return {
      verdict: "UNKNOWN",
      reason: unknownRule?.reason ?? "One or more rules returned UNKNOWN",
    };
  }

  if (confidence === "LOW") {
    return {
      verdict: "UNKNOWN",
      reason: "Insufficient signal confidence to determine validity",
    };
  }

  return { verdict: "VALID", reason: "All rules passed with high confidence" };
}

async function runPipeline(
  claim: ActionClaim | RecoveryClaim,
  claimType: "action" | "recovery"
): Promise<ValidationResponse> {
  const normalizedInput = normalizeInput(claim as unknown as Record<string, unknown>);
  const inputHash = computeInputHash(normalizedInput);

  const sigResult = verifySignature(claim.signature, inputHash);

  const context = reconstructContext(claim, claimType);

  const ruleResults = evaluateRules(claim, claimType);

  const confidence = assessConfidence(ruleResults, sigResult);

  const { verdict, reason } = decide(ruleResults, confidence, sigResult);

  const signatureStatus = sigResult.valid === true ? "valid"
    : sigResult.valid === false ? "failed"
    : "skipped";

  const [evidence] = await db.insert(validationEvidenceTable).values({
    verdict,
    confidence,
    reason,
    inputHash,
    actionType: claim.actionType,
    callerId: claim.callerId ?? null,
    requestPayload: claim as unknown as Record<string, unknown>,
    ruleResults: ruleResults as unknown as Record<string, unknown>[],
    pipelineContext: { signatureStatus, claimType, context },
  }).returning();

  logger.info({ evidenceId: evidence.id, verdict, confidence, actionType: claim.actionType }, `${claimType} validated`);

  return {
    status: verdict,
    reason,
    confidence,
    evidenceId: evidence.id,
    ruleResults,
  };
}

export async function validateAction(claim: ActionClaim): Promise<ValidationResponse> {
  return runPipeline(claim, "action");
}

export async function validateRecovery(claim: RecoveryClaim): Promise<ValidationResponse> {
  return runPipeline(claim, "recovery");
}
