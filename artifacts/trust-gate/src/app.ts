import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
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
app.use(express.json());
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
