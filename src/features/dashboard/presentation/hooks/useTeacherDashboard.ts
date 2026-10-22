import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { staleTimes } from "@/shared/query/queryRoots";
import { dashboardKeys } from "../queryKeys";
import { useDashboardFilters } from "../store/useDashboardFilters";

export function useTeacherDashboard() {
  const { dashboardRepository } = useDependencies();
  const filters = useDashboardFilters((state) => state.filters);
  return useQuery({
    queryKey: dashboardKeys.overview(filters),
    queryFn: ({ signal }) => dashboardRepository.loadOverview(filters, signal),
    placeholderData: keepPreviousData,
    staleTime: staleTimes.medium,
  });
}
