import { Router, type IRouter } from "express";
import healthRouter from "./health";
import archiveRouter from "./archive";
import publicSettingsRouter from "./public-settings";
import adminRouter from "./admin";
import adminLaunchesRouter from "./admin-launches";
import recipesRouter from "./recipes";
import storageRouter from "./storage";
import testimonialsRouter from "./testimonials";
import bakeryAddonsRouter from "./bakery-addons";
import journalRouter from "./journal";

const router: IRouter = Router();

router.use(healthRouter);
router.use(archiveRouter);
router.use(publicSettingsRouter);
router.use(adminRouter);
router.use(adminLaunchesRouter);
router.use(recipesRouter);
router.use(storageRouter);
router.use(testimonialsRouter);
router.use(bakeryAddonsRouter);
router.use(journalRouter);

export default router;
