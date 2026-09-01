import { useQuery } from "@tanstack/react-query";
import { getOverview, getAnalytics } from "@/services/dashboard.service";

export function useOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: getOverview,
    refetchInterval: 30_000,
  });
}

export function useAnalytics(days: number = 30) {
  return useQuery({
    queryKey: ["dashboard", "analytics", days],
    queryFn: () => getAnalytics(days),
    refetchInterval: 60_000,
  });
}
