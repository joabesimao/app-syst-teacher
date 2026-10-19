import { request } from "../../services/apiClient";
import type { DashboardFilters, TeacherDashboard } from "./types";

export function loadTeacherDashboard(filters: DashboardFilters, signal?: AbortSignal) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const suffix = search.toString();
  return request<TeacherDashboard>(`/dashboard/overview${suffix ? `?${suffix}` : ""}`, { signal });
}
