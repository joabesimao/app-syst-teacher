import type { HttpClient } from "@/core/http/HttpClient";
import type { DashboardRepository } from "../domain/DashboardRepository";
import type { DashboardFilters, TeacherDashboard } from "../domain/models";

export class HttpDashboardRepository implements DashboardRepository {
  constructor(private readonly http: HttpClient) {}

  loadOverview(filters: DashboardFilters, signal?: AbortSignal): Promise<TeacherDashboard> {
    return this.http.get<TeacherDashboard>("/dashboard/overview", { query: { ...filters }, signal });
  }
}
