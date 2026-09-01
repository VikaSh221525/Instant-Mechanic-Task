"use client";

import { Header } from "@/components/layout/Header";
import { BookingsChart } from "@/components/dashboard/BookingsChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { ServiceChart } from "@/components/dashboard/ServiceChart";
import { useAnalytics } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics(30);

  return (
    <>
      <Header title="Analytics" subtitle="Last 30 days performance" />
      <div className="p-4 lg:p-8 space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[340px] rounded-xl" />
            ))}
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BookingsChart data={data.bookingsOverTime} />
            <RevenueChart data={data.revenueOverTime} />
            <StatusChart data={data.statusBreakdown} />
            <ServiceChart data={data.serviceBreakdown} />
          </div>
        ) : null}
      </div>
    </>
  );
}
