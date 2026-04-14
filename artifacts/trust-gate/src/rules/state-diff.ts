import type { ActionClaim, RecoveryClaim, RuleResult } from "../core/types";

export function stateDiffRule(claim: ActionClaim | RecoveryClaim, claimType: "action" | "recovery"): RuleResult {
  if (claimType !== "recovery") {
    return {
      ruleName: "state-diff",
      status: "VALID",
      reason: "Not a recovery claim, skipping state diff",
    };
  }

  const recovery = claim as RecoveryClaim;

  if (!recovery.beforeState || !recovery.afterState) {
    return {
      ruleName: "state-diff",
      status: "REJECTED",
      reason: "Recovery claim missing before/after state",
    };
  }

  const beforeKeys = Object.keys(recovery.beforeState);
  const afterKeys = Object.keys(recovery.afterState);

  if (beforeKeys.length === 0 || afterKeys.length === 0) {
    return {
      ruleName: "state-diff",
      status: "REJECTED",
      reason: "Before or after state is empty",
    };
  }

  const beforeJson = JSON.stringify(recovery.beforeState);
  const afterJson = JSON.stringify(recovery.afterState);

  if (beforeJson === afterJson) {
    return {
      ruleName: "state-diff",
      status: "REJECTED",
      reason: "Before and after states are identical — no change detected",
    };
  }

  const beforeStatus = recovery.beforeState["status"] as string | undefined;
  const afterStatus = recovery.afterState["status"] as string | undefined;

  if (beforeStatus && afterStatus && beforeStatus === afterStatus) {
    return {
      ruleName: "state-diff",
      status: "REJECTED",
      reason: `Status unchanged: "${beforeStatus}" → "${afterStatus}" — recovery claim is false`,
    };
  }

  return {
    ruleName: "state-diff",
    status: "VALID",
    reason: "State change detected between before and after",
  };
}
