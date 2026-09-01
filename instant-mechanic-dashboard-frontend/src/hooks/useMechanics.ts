import { useQuery } from "@tanstack/react-query";
import { getMechanics } from "@/services/mechanic.service";
import type { MechanicFilters } from "@/types/mechanic";

export function useMechanics(filters: MechanicFilters = {}) {
  return useQuery({
    queryKey: ["mechanics", filters],
    queryFn: () => getMechanics(filters),
  });
}
