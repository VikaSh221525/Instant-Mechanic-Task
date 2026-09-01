import { FilterQuery, Types } from "mongoose";
import { Customer, ICustomer } from "../models/Customer";
import { Booking } from "../models/Booking";
import { ApiError } from "../utils/ApiError";

export interface ListCustomersQuery {
  page: number;
  limit: number;
  skip: number;
  search?: string;
}

export async function listCustomers(query: ListCustomersQuery) {
  const filter: FilterQuery<ICustomer> = {};
  if (query.search) filter.$text = { $search: query.search };

  const [items, total] = await Promise.all([
    Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip(query.skip)
      .limit(query.limit)
      .lean(),
    Customer.countDocuments(filter),
  ]);

  return { items, total };
}

export async function getCustomerById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid customer id");
  }
  const customer = await Customer.findById(id).lean();
  if (!customer) {
    throw ApiError.notFound("Customer not found");
  }

  const bookings = await Booking.find({ customer: id })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("bookingId status amount scheduledAt")
    .lean();

  return { ...customer, bookings };
}
