export interface DashboardOverview {
  totalBookings: number;
  todaysBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  activeMechanics: number;
  totalMechanics: number;
  newCustomers: number;
}

export interface BookingsOverTimeEntry {
  date: string;
  count: number;
}

export interface RevenueOverTimeEntry {
  date: string;
  revenue: number;
}

export interface StatusBreakdownEntry {
  status: string;
  count: number;
}

export interface ServiceBreakdownEntry {
  category: string;
  count: number;
  revenue: number;
}

export interface DashboardAnalytics {
  bookingsOverTime: BookingsOverTimeEntry[];
  revenueOverTime: RevenueOverTimeEntry[];
  statusBreakdown: StatusBreakdownEntry[];
  serviceBreakdown: ServiceBreakdownEntry[];
}
