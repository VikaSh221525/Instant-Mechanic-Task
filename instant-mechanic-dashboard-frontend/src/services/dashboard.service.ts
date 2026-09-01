import { apiFetch, buildQueryString } from "@/lib/api";
import type { DashboardOverview, DashboardAnalytics } from "@/types/dashboard";

export async function getOverview(): Promise<DashboardOverview> {
  const res = await apiFetch<DashboardOverview>("/dashboard/overview");
  return res.data;
}

export async function getAnalytics(
  days: number = 30
): Promise<DashboardAnalytics> {
  const qs = buildQueryString({ days });
  const res = await apiFetch<DashboardAnalytics>(`/dashboard/analytics${qs}`);
  return res.data;
}
