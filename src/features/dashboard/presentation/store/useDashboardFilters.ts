import { create } from "zustand";
import type { DashboardFilters } from "../../domain/models";

interface DashboardFiltersState {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
}

export const useDashboardFilters = create<DashboardFiltersState>((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
}));
