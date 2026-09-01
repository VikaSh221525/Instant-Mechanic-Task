import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import * as dashboardService from "../services/dashboard.service";

export const getOverview = asyncHandler(async (_req: Request, res: Response) => {
  const overview = await dashboardService.getOverview();
  sendSuccess(res, overview);
});

export const getAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(String(req.query.days), 10) : 30;
  const analytics = await dashboardService.getAnalytics(days);
  sendSuccess(res, analytics);
});
