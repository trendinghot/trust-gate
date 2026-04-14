import { z } from "zod/v4";

export const ActionClaimSchema = z.object({
  actionType: z.string(),
  systemId: z.string(),
  callerId: z.string().optional(),
  timestamp: z.string(),
  payload: z.record(z.string(), z.unknown()),
  signature: z.string().optional(),
});

export const RecoveryClaimSchema = z.object({
  actionType: z.string(),
  systemId: z.string(),
  callerId: z.string().optional(),
  timestamp: z.string(),
  beforeState: z.record(z.string(), z.unknown()),
  afterState: z.record(z.string(), z.unknown()),
  payload: z.record(z.string(), z.unknown()),
  signature: z.string().optional(),
});
