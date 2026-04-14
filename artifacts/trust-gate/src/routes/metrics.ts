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
  });
});

export default router;
