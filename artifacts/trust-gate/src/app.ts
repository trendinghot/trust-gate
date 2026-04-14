import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { createHash } from "node:crypto";
import { db } from "@workspace/db";
import { validationEvidenceTable } from "@workspace/db/schema";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({
  verify: (req: Request & { rawBody?: string }, _res, buf) => {
    req.rawBody = buf.toString();
  },
}));

app.use(async (err: Error & { type?: string; status?: number }, req: Request & { rawBody?: string }, res: Response, next: NextFunction) => {
  if (err.type === "entity.parse.failed") {
    const rawBody = req.rawBody ?? "";
    const inputHash = createHash("sha256").update(rawBody).digest("hex");

    try {
      const [evidence] = await db.insert(validationEvidenceTable).values({
        verdict: "REJECTED",
        confidence: "HIGH",
        reason: `Malformed JSON: ${err.message}`,
        inputHash,
        actionType: "unknown",
        callerId: null,
        requestPayload: { raw: rawBody.slice(0, 4096) },
        ruleResults: [],
        pipelineContext: { parseError: true, errorType: "malformed_json" },
      }).returning();

      res.status(400).json({
        status: "REJECTED",
        reason: `Malformed JSON: ${err.message}`,
        confidence: "HIGH",
        evidenceId: evidence.id,
        ruleResults: [],
      });
    } catch (dbErr) {
      logger.error({ err: dbErr }, "Failed to persist malformed JSON evidence");
      res.status(400).json({
        status: "REJECTED",
        reason: `Malformed JSON: ${err.message}`,
        confidence: "HIGH",
        ruleResults: [],
      });
    }
    return;
  }
  next(err);
});

app.use(express.urlencoded({ extended: true }));

const PROXY_PREFIX = "/trust-gate";
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.url.startsWith(PROXY_PREFIX)) {
    req.url = req.url.slice(PROXY_PREFIX.length) || "/";
  }
  next();
});

app.use("/", router);

export default app;
