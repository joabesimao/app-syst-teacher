import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { loadTeacherDashboard } from "./api";
import type { DashboardFilters } from "./types";

interface DashboardFiltersState {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
}

export const useDashboardFilters = create<DashboardFiltersState>((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
}));

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: (filters: DashboardFilters) => [...dashboardKeys.all, "overview", filters] as const,
};

export function useTeacherDashboard() {
  const filters = useDashboardFilters((state) => state.filters);
  return useQuery({
    queryKey: dashboardKeys.overview(filters),
    queryFn: ({ signal }) => loadTeacherDashboard(filters, signal),
    placeholderData: keepPreviousData,
  });
}
