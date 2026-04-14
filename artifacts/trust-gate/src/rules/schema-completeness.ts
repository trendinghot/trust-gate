import type { ActionClaim, RecoveryClaim, RuleResult } from "../core/types";

export function schemaCompletenessRule(claim: ActionClaim | RecoveryClaim, claimType: "action" | "recovery"): RuleResult {
  const missing: string[] = [];

  if (!claim.actionType) missing.push("actionType");
  if (!claim.systemId) missing.push("systemId");
  if (!claim.timestamp) missing.push("timestamp");

  if (claimType === "recovery") {
    const recovery = claim as RecoveryClaim;
    if (!recovery.beforeState || Object.keys(recovery.beforeState).length === 0) {
      missing.push("beforeState");
    }
    if (!recovery.afterState || Object.keys(recovery.afterState).length === 0) {
      missing.push("afterState");
    }
  }

  if (missing.length > 0) {
    return {
      ruleName: "schema-completeness",
      status: "REJECTED",
      reason: `Missing required fields: ${missing.join(", ")}`,
    };
  }

  return {
    ruleName: "schema-completeness",
    status: "VALID",
    reason: "All required fields present",
  };
}
