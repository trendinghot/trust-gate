import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { validationEvidenceTable } from "@workspace/db/schema";
import { createHash } from "node:crypto";
import { ActionClaimSchema, RecoveryClaimSchema } from "../schemas";
import { validateAction, validateRecovery } from "../core/pipeline";

const router: IRouter = Router();

async function persistParseRejection(body: unknown, reason: string, claimType: string): Promise<string> {
  const raw = JSON.stringify(body ?? {});
  const inputHash = createHash("sha256").update(raw).digest("hex");
  const [evidence] = await db.insert(validationEvidenceTable).values({
    verdict: "REJECTED",
    confidence: "HIGH",
    reason,
    inputHash,
    actionType: "unknown",
    callerId: null,
    requestPayload: (body ?? {}) as Record<string, unknown>,
    ruleResults: [],
    pipelineContext: { claimType, parseError: true },
  }).returning();
  return evidence.id;
}

router.post("/validate-action", async (req, res) => {
  const parsed = ActionClaimSchema.safeParse(req.body);
  if (!parsed.success) {
    const reason = `Invalid request body: ${parsed.error.message}`;
    const evidenceId = await persistParseRejection(req.body, reason, "action");
    res.status(400).json({
      status: "REJECTED",
      reason,
      confidence: "HIGH",
      evidenceId,
      ruleResults: [],
    });
    return;
  }

  const result = await validateAction(parsed.data);
  const httpStatus = result.status === "VALID" ? 200 : result.status === "REJECTED" ? 422 : 200;
  res.status(httpStatus).json(result);
});

router.post("/validate-recovery", async (req, res) => {
  const parsed = RecoveryClaimSchema.safeParse(req.body);
  if (!parsed.success) {
    const reason = `Invalid request body: ${parsed.error.message}`;
    const evidenceId = await persistParseRejection(req.body, reason, "recovery");
    res.status(400).json({
      status: "REJECTED",
      reason,
      confidence: "HIGH",
      evidenceId,
      ruleResults: [],
    });
    return;
  }

  const result = await validateRecovery(parsed.data);
  const httpStatus = result.status === "VALID" ? 200 : result.status === "REJECTED" ? 422 : 200;
  res.status(httpStatus).json(result);
});

export default router;
