import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { validationEvidenceTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/metrics/validations", async (_req, res) => {
  const byStatus = await db
    .select({
      verdict: validationEvidenceTable.verdict,
      count: sql<number>`count(*)::int`,
    })
    .from(validationEvidenceTable)
    .groupBy(validationEvidenceTable.verdict);

  const byActionType = await db
    .select({
      actionType: validationEvidenceTable.actionType,
      verdict: validationEvidenceTable.verdict,
      count: sql<number>`count(*)::int`,
    })
    .from(validationEvidenceTable)
    .groupBy(validationEvidenceTable.actionType, validationEvidenceTable.verdict);

  const byRule = await db.execute(sql`
    SELECT
      rule_result->>'ruleName' AS rule_name,
      rule_result->>'status' AS rule_status,
      count(*)::int AS count
    FROM validation_evidence,
      jsonb_array_elements(rule_results) AS rule_result
    GROUP BY rule_result->>'ruleName', rule_result->>'status'
    ORDER BY rule_name, rule_status
  `);

  const total = byStatus.reduce((sum, row) => sum + row.count, 0);
  const statusMap: Record<string, number> = {};
  for (const row of byStatus) {
    statusMap[row.verdict] = row.count;
  }

  res.json({
    total,
    byStatus: {
      VALID: statusMap["VALID"] ?? 0,
      REJECTED: statusMap["REJECTED"] ?? 0,
      UNKNOWN: statusMap["UNKNOWN"] ?? 0,
    },
    byActionType,
    byRule: byRule.rows,
  });
});

export default router;
