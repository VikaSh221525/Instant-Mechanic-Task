import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { getPagination, buildMeta } from "../utils/pagination";
import * as mechanicService from "../services/mechanic.service";

export const getMechanics = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const { items, total } = await mechanicService.listMechanics({
    page,
    limit,
    skip,
    search: req.query.search ? String(req.query.search) : undefined,
    status: req.query.status ? String(req.query.status) : undefined,
  });
  sendSuccess(res, items, buildMeta(page, limit, total));
});

export const getMechanicById = asyncHandler(async (req: Request, res: Response) => {
  const mechanic = await mechanicService.getMechanicById(req.params.id);
  sendSuccess(res, mechanic);
});
