export type Verdict = "VALID" | "REJECTED" | "UNKNOWN";
export type Confidence = "HIGH" | "LOW";

export interface RuleResult {
  ruleName: string;
  status: Verdict;
  reason: string;
}

export interface ActionClaim {
  actionType: string;
  systemId: string;
  callerId?: string;
  timestamp: string;
  payload: Record<string, unknown>;
  signature?: string;
}

export interface RecoveryClaim {
  actionType: string;
  systemId: string;
  callerId?: string;
  timestamp: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature?: string;
}

export interface PipelineContext {
  normalizedInput: Record<string, unknown>;
  inputHash: string;
  signatureValid: boolean | null;
  ruleResults: RuleResult[];
  confidence: Confidence;
  verdict: Verdict;
  reason: string;
  claimType: "action" | "recovery";
}

export interface ValidationResponse {
  status: Verdict;
  reason: string;
  confidence: Confidence;
  evidenceId: string;
  ruleResults: RuleResult[];
}
