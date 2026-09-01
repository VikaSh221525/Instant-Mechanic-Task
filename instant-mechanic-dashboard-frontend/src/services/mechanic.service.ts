import { apiFetch, buildQueryString } from "@/lib/api";
import type { Mechanic, MechanicFilters } from "@/types/mechanic";
import type { ApiResponse } from "@/types/api";

export async function getMechanics(
  filters: MechanicFilters = {}
): Promise<ApiResponse<Mechanic[]>> {
  const qs = buildQueryString({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    status: filters.status || undefined,
  });
  return apiFetch<Mechanic[]>(`/mechanics${qs}`);
}

export async function getMechanicById(id: string): Promise<Mechanic> {
  const res = await apiFetch<Mechanic>(`/mechanics/${id}`);
  return res.data;
}
