import type { ActionClaim, RecoveryClaim, RuleResult } from "../core/types";

const ALLOWED_ACTION_TYPES = new Set([
  "service-restart",
  "config-update",
  "deployment",
  "rollback",
  "health-check",
  "scaling",
  "certificate-renewal",
  "dns-update",
  "cache-flush",
  "database-migration",
]);

export function actionTypeAllowlistRule(claim: ActionClaim | RecoveryClaim, _claimType: "action" | "recovery"): RuleResult {
  if (!claim.actionType) {
    return {
      ruleName: "action-type-allowlist",
      status: "REJECTED",
      reason: "No action type provided",
    };
  }

  if (!ALLOWED_ACTION_TYPES.has(claim.actionType)) {
    return {
      ruleName: "action-type-allowlist",
      status: "UNKNOWN",
      reason: `Action type "${claim.actionType}" is not in the allowlist`,
    };
  }

  return {
    ruleName: "action-type-allowlist",
    status: "VALID",
    reason: `Action type "${claim.actionType}" is allowed`,
  };
}
