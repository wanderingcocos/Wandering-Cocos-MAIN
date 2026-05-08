import { Router, type IRouter } from "express";
import healthRouter from "./health";
import archiveRouter from "./archive";
import publicSettingsRouter from "./public-settings";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(archiveRouter);
router.use(publicSettingsRouter);
router.use(adminRouter);

export default router;
