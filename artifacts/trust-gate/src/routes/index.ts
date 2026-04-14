import { Router, type IRouter } from "express";
import healthRouter from "./health";
import validateRouter from "./validate";
import evidenceRouter from "./evidence";
import metricsRouter from "./metrics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(validateRouter);
router.use(evidenceRouter);
router.use(metricsRouter);

export default router;
