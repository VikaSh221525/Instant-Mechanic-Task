import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { getPagination, buildMeta } from "../utils/pagination";
import * as customerService from "../services/customer.service";

export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const { items, total } = await customerService.listCustomers({
    page,
    limit,
    skip,
    search: req.query.search ? String(req.query.search) : undefined,
  });
  sendSuccess(res, items, buildMeta(page, limit, total));
});

export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.getCustomerById(req.params.id);
  sendSuccess(res, customer);
});
