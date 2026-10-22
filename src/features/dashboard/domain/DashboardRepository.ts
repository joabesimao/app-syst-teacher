import type { DashboardFilters, TeacherDashboard } from "./models";

export interface DashboardRepository {
  loadOverview(filters: DashboardFilters, signal?: AbortSignal): Promise<TeacherDashboard>;
}
