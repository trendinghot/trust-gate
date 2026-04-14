import { createHash } from "node:crypto";
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

function verifySignature(signature: string | undefined, _inputHash: string): boolean | null {
  if (!signature) return null;
  const secret = process.env.TRUST_GATE_HMAC_SECRET;
  if (!secret) return null;
  const expected = createHash("sha256").update(_inputHash + secret).digest("hex");
  return signature === expected;
}

function assessConfidence(ruleResults: RuleResult[]): Confidence {
  const validCount = ruleResults.filter(r => r.status === "VALID").length;
  const totalEvaluated = ruleResults.length;
  if (totalEvaluated === 0) return "LOW";
  if (validCount > 1) return "HIGH";
  return "LOW";
}

function decide(ruleResults: RuleResult[], confidence: Confidence): { verdict: Verdict; reason: string } {
  const rejected = ruleResults.find(r => r.status === "REJECTED");
  if (rejected) {
    return { verdict: "REJECTED", reason: rejected.reason };
  }

  const unknown = ruleResults.find(r => r.status === "UNKNOWN");
  if (confidence === "LOW") {
    return {
      verdict: "UNKNOWN",
      reason: unknown?.reason ?? "Insufficient signal confidence to determine validity",
    };
  }

  return { verdict: "VALID", reason: "All rules passed with high confidence" };
}

export async function validateAction(claim: ActionClaim): Promise<ValidationResponse> {
  const normalizedInput = normalizeInput(claim as unknown as Record<string, unknown>);
  const inputHash = computeInputHash(normalizedInput);
  const signatureValid = verifySignature(claim.signature, inputHash);

  const ruleResults = evaluateRules(claim, "action");
  const confidence = assessConfidence(ruleResults);
  const { verdict, reason } = decide(ruleResults, confidence);

  const ctx: PipelineContext = {
    normalizedInput,
    inputHash,
    signatureValid,
    ruleResults,
    confidence,
    verdict,
    reason,
    claimType: "action",
  };

  const [evidence] = await db.insert(validationEvidenceTable).values({
    verdict,
    confidence,
    reason,
    inputHash,
    actionType: claim.actionType,
    callerId: claim.callerId ?? null,
    requestPayload: claim as unknown as Record<string, unknown>,
    ruleResults: ruleResults as unknown as Record<string, unknown>[],
    pipelineContext: { signatureValid, claimType: "action" },
  }).returning();

  logger.info({ evidenceId: evidence.id, verdict, confidence, actionType: claim.actionType }, "Action validated");

  return {
    status: verdict,
    reason,
    confidence,
    evidenceId: evidence.id,
    ruleResults,
  };
}

export async function validateRecovery(claim: RecoveryClaim): Promise<ValidationResponse> {
  const normalizedInput = normalizeInput(claim as unknown as Record<string, unknown>);
  const inputHash = computeInputHash(normalizedInput);
  const signatureValid = verifySignature(claim.signature, inputHash);

  const ruleResults = evaluateRules(claim, "recovery");
  const confidence = assessConfidence(ruleResults);
  const { verdict, reason } = decide(ruleResults, confidence);

  const [evidence] = await db.insert(validationEvidenceTable).values({
    verdict,
    confidence,
    reason,
    inputHash,
    actionType: claim.actionType,
    callerId: claim.callerId ?? null,
    requestPayload: claim as unknown as Record<string, unknown>,
    ruleResults: ruleResults as unknown as Record<string, unknown>[],
    pipelineContext: { signatureValid, claimType: "recovery" },
  }).returning();

  logger.info({ evidenceId: evidence.id, verdict, confidence, actionType: claim.actionType }, "Recovery validated");

  return {
    status: verdict,
    reason,
    confidence,
    evidenceId: evidence.id,
    ruleResults,
  };
}
