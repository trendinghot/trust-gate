import type { ActionClaim, RecoveryClaim, RuleResult } from "./types";
import { schemaCompletenessRule } from "../rules/schema-completeness";
import { timestampFreshnessRule } from "../rules/timestamp-freshness";
import { actionTypeAllowlistRule } from "../rules/action-type-allowlist";
import { stateDiffRule } from "../rules/state-diff";

export type RuleFn = (claim: ActionClaim | RecoveryClaim, claimType: "action" | "recovery") => RuleResult;

const actionRules: RuleFn[] = [
  schemaCompletenessRule,
  timestampFreshnessRule,
  actionTypeAllowlistRule,
];

const recoveryRules: RuleFn[] = [
  schemaCompletenessRule,
  timestampFreshnessRule,
  actionTypeAllowlistRule,
  stateDiffRule,
];

export function evaluateRules(claim: ActionClaim | RecoveryClaim, claimType: "action" | "recovery"): RuleResult[] {
  const rules = claimType === "action" ? actionRules : recoveryRules;
  return rules.map(rule => rule(claim, claimType));
}
