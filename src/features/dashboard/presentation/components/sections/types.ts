import type { DashboardFilters, TeacherDashboard } from "../../../domain/models";

export interface SectionProps {
  data: TeacherDashboard;
  filters: DashboardFilters;
}
