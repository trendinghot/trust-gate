import { Router, type IRouter } from "express";
import { ActionClaimSchema, RecoveryClaimSchema } from "../schemas";
import { validateAction, validateRecovery } from "../core/pipeline";

const router: IRouter = Router();

router.post("/validate-action", async (req, res) => {
  const parsed = ActionClaimSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      status: "REJECTED",
      reason: `Invalid request body: ${parsed.error.message}`,
      confidence: "HIGH",
      evidenceId: null,
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
    res.status(400).json({
      status: "REJECTED",
      reason: `Invalid request body: ${parsed.error.message}`,
      confidence: "HIGH",
      evidenceId: null,
      ruleResults: [],
    });
    return;
  }

  const result = await validateRecovery(parsed.data);
  const httpStatus = result.status === "VALID" ? 200 : result.status === "REJECTED" ? 422 : 200;
  res.status(httpStatus).json(result);
});

export default router;
