import type { ActionClaim, RecoveryClaim, RuleResult } from "../core/types";

const MAX_AGE_MS = 5 * 60 * 1000;

export function timestampFreshnessRule(claim: ActionClaim | RecoveryClaim, _claimType: "action" | "recovery"): RuleResult {
  const claimTime = new Date(claim.timestamp).getTime();

  if (isNaN(claimTime)) {
    return {
      ruleName: "timestamp-freshness",
      status: "REJECTED",
      reason: "Invalid timestamp format",
    };
  }

  const age = Date.now() - claimTime;

  if (age > MAX_AGE_MS) {
    return {
      ruleName: "timestamp-freshness",
      status: "REJECTED",
      reason: `Claim is stale: ${Math.round(age / 1000)}s old (max ${MAX_AGE_MS / 1000}s)`,
    };
  }

  if (age < -60_000) {
    return {
      ruleName: "timestamp-freshness",
      status: "REJECTED",
      reason: "Claim timestamp is in the future",
    };
  }

  return {
    ruleName: "timestamp-freshness",
    status: "VALID",
    reason: "Timestamp is fresh",
  };
}
