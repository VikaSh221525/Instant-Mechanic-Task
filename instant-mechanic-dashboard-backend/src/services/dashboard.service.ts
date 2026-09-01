import { Booking } from "../models/Booking";
import { Customer } from "../models/Customer";
import { Mechanic } from "../models/Mechanic";
import { BookingStatus, MechanicStatus } from "../types";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getOverview() {
  const todayStart = startOfToday();

  const [
    totalBookings,
    todaysBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    activeMechanics,
    totalMechanics,
    revenueAgg,
    newCustomers,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ createdAt: { $gte: todayStart } }),
    Booking.countDocuments({ status: BookingStatus.COMPLETED }),
    Booking.countDocuments({ status: BookingStatus.PENDING }),
    Booking.countDocuments({ status: BookingStatus.CANCELLED }),
    Mechanic.countDocuments({ status: { $ne: MechanicStatus.OFFLINE } }),
    Mechanic.countDocuments(),
    Booking.aggregate([
      { $match: { status: BookingStatus.COMPLETED } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Customer.countDocuments({ createdAt: { $gte: todayStart } }),
  ]);

  const totalRevenue = revenueAgg[0]?.total ?? 0;

  return {
    totalBookings,
    todaysBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalRevenue,
    activeMechanics,
    totalMechanics,
    newCustomers,
  };
}

export async function getAnalytics(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const [bookingsOverTime, revenueOverTime, statusBreakdown, serviceBreakdown] =
    await Promise.all([
      Booking.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", count: 1 } },
      ]),
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: since },
            status: BookingStatus.COMPLETED,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", revenue: 1 } },
      ]),
      Booking.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { _id: 0, status: "$_id", count: 1 } },
      ]),
      Booking.aggregate([
        {
          $lookup: {
            from: "services",
            localField: "service",
            foreignField: "_id",
            as: "serviceInfo",
          },
        },
        { $unwind: "$serviceInfo" },
        {
          $group: {
            _id: "$serviceInfo.category",
            count: { $sum: 1 },
            revenue: { $sum: "$amount" },
          },
        },
        { $project: { _id: 0, category: "$_id", count: 1, revenue: 1 } },
        { $sort: { count: -1 } },
      ]),
    ]);

  return { bookingsOverTime, revenueOverTime, statusBreakdown, serviceBreakdown };
}
