import { pgTable, text, uuid, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const verdictEnum = pgEnum("verdict", ["VALID", "REJECTED", "UNKNOWN"]);
export const confidenceEnum = pgEnum("confidence_level", ["HIGH", "LOW"]);

export const validationEvidenceTable = pgTable("validation_evidence", {
  id: uuid("id").defaultRandom().primaryKey(),
  verdict: verdictEnum("verdict").notNull(),
  confidence: confidenceEnum("confidence").notNull(),
  reason: text("reason").notNull(),
  inputHash: text("input_hash").notNull(),
  actionType: text("action_type").notNull(),
  callerId: text("caller_id"),
  requestPayload: jsonb("request_payload").notNull(),
  ruleResults: jsonb("rule_results").notNull(),
  pipelineContext: jsonb("pipeline_context"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ValidationEvidence = typeof validationEvidenceTable.$inferSelect;
export type InsertValidationEvidence = typeof validationEvidenceTable.$inferInsert;
