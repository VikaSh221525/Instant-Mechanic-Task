"use client";

import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  Wrench,
  UserPlus,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { LiveActivity } from "@/components/dashboard/LiveActivity";
import { useOverview } from "@/hooks/useDashboard";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data, isLoading } = useOverview();

  return (
    <>
      <Header title="Overview" subtitle="Real-time operations dashboard" />
      <div className="p-4 lg:p-8 space-y-6">
        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[104px] rounded-xl" />
            ))}
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="Total Bookings"
              value={formatNumber(data.totalBookings)}
              icon={CalendarCheck}
              iconColor="text-indigo-400"
              iconBg="bg-indigo-500/10"
            />
            <StatsCard
              label="Today's Bookings"
              value={data.todaysBookings}
              icon={CalendarClock}
              iconColor="text-blue-400"
              iconBg="bg-blue-500/10"
            />
            <StatsCard
              label="Completed"
              value={formatNumber(data.completedBookings)}
              icon={CheckCircle2}
              iconColor="text-emerald-400"
              iconBg="bg-emerald-500/10"
            />
            <StatsCard
              label="Pending"
              value={data.pendingBookings}
              icon={Clock}
              iconColor="text-amber-400"
              iconBg="bg-amber-500/10"
            />
            <StatsCard
              label="Cancelled"
              value={data.cancelledBookings}
              icon={XCircle}
              iconColor="text-red-400"
              iconBg="bg-red-500/10"
            />
            <StatsCard
              label="Total Revenue"
              value={formatCurrency(data.totalRevenue)}
              icon={IndianRupee}
              iconColor="text-emerald-400"
              iconBg="bg-emerald-500/10"
            />
            <StatsCard
              label="Active Mechanics"
              value={`${data.activeMechanics}/${data.totalMechanics}`}
              icon={Wrench}
              iconColor="text-violet-400"
              iconBg="bg-violet-500/10"
            />
            <StatsCard
              label="New Customers"
              value={data.newCustomers}
              icon={UserPlus}
              iconColor="text-cyan-400"
              iconBg="bg-cyan-500/10"
              subtitle="Today"
            />
          </div>
        ) : null}

        {/* Bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentBookings />
          <LiveActivity />
        </div>
      </div>
    </>
  );
}
