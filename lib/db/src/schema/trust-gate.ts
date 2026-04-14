import { pgTable, text, uuid, timestamp, jsonb, pgEnum, boolean as pgBoolean, index } from "drizzle-orm/pg-core";

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
}, (table) => [
  index("idx_validation_evidence_input_hash").on(table.inputHash),
  index("idx_validation_evidence_action_type").on(table.actionType),
  index("idx_validation_evidence_created_at").on(table.createdAt),
]);

export type ValidationEvidence = typeof validationEvidenceTable.$inferSelect;
export type InsertValidationEvidence = typeof validationEvidenceTable.$inferInsert;

export const validationRulesTable = pgTable("validation_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  enabled: pgBoolean("enabled").default(true).notNull(),
  config: jsonb("config"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ValidationRule = typeof validationRulesTable.$inferSelect;
export type InsertValidationRule = typeof validationRulesTable.$inferInsert;
