import { queryRoots } from "@/shared/query/queryRoots";
import type { DashboardFilters } from "../domain/models";

export const dashboardKeys = {
  all: [queryRoots.dashboard] as const,
  overview: (filters: DashboardFilters) => [...dashboardKeys.all, "overview", filters] as const,
};
