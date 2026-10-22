import type { ComponentType } from "react";
import { AssessmentsSection } from "./AssessmentsSection";
import { ClassAttendanceSection } from "./ClassAttendanceSection";
import { KpiTiles } from "./KpiTiles";
import { RankingSection } from "./RankingSection";
import { ReportCardsSection } from "./ReportCardsSection";
import { StatusByDisciplineSection } from "./StatusByDisciplineSection";
import { StatusSection } from "./StatusSection";
import { StudentAttendanceSection } from "./StudentAttendanceSection";
import { TermAveragesSection } from "./TermAveragesSection";
import type { SectionProps } from "./types";

export type { SectionProps } from "./types";

export const DASHBOARD_SECTIONS: { key: string; Component: ComponentType<SectionProps> }[] = [
  { key: "kpis", Component: KpiTiles },
  { key: "status", Component: StatusSection },
  { key: "status-discipline", Component: StatusByDisciplineSection },
  { key: "term-averages", Component: TermAveragesSection },
  { key: "class-attendance", Component: ClassAttendanceSection },
  { key: "student-attendance", Component: StudentAttendanceSection },
  { key: "ranking", Component: RankingSection },
  { key: "assessments", Component: AssessmentsSection },
  { key: "report-cards", Component: ReportCardsSection },
];
