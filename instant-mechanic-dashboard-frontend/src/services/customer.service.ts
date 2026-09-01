import { apiFetch, buildQueryString } from "@/lib/api";
import type { Customer, CustomerFilters } from "@/types/customer";
import type { ApiResponse } from "@/types/api";

export async function getCustomers(
  filters: CustomerFilters = {}
): Promise<ApiResponse<Customer[]>> {
  const qs = buildQueryString({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
  });
  return apiFetch<Customer[]>(`/customers${qs}`);
}

export async function getCustomerById(id: string): Promise<Customer> {
  const res = await apiFetch<Customer>(`/customers/${id}`);
  return res.data;
}
