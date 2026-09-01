import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";

const router = Router();

router.get("/overview", dashboardController.getOverview);
router.get("/analytics", dashboardController.getAnalytics);

export default router;
