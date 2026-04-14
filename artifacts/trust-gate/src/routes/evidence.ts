import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { validationEvidenceTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/evidence/:id", async (req, res) => {
  const { id } = req.params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    res.status(400).json({ error: "Invalid evidence ID format" });
    return;
  }

  const [evidence] = await db
    .select()
    .from(validationEvidenceTable)
    .where(eq(validationEvidenceTable.id, id))
    .limit(1);

  if (!evidence) {
    res.status(404).json({ error: "Evidence not found" });
    return;
  }

  res.json(evidence);
});

export default router;
