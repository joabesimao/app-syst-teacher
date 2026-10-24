import type { AssessmentStatus } from "@/features/assessments/domain/models";
import type { ConsolidationScaleKind, ConsolidationScaleOption, OptionCounts } from "@/features/consolidations";

export type FinalStatus = "APPROVED" | "RECOVERY" | "FAILED" | "NO_GRADES";

export type AssessmentKind = "REGULAR" | "RECOVERY";

export type TermSeries = (number | null)[];

export interface DashboardFilters {
  schoolYear?: number;
  term?: number;
  classId?: string;
  disciplineName?: string;
}

export interface DashboardClassOption {
  id: string;
  name: string;
  gradeLevel: string;
  disciplines: string[];
}

export interface DashboardKpis {
  students: number;
  officialAverage: number | null;
  partialAverage: number | null;
  attendancePercent: number | null;
  atRiskStudents: number;
  belowMinimumAttendance: number;
  assessments: { total: number; completed: number };
}

export interface StatusSummary {
  approved: number;
  recovery: number;
  failed: number;
  noGrades: number;
}

export interface DisciplineStatusSummary extends StatusSummary {
  disciplineName: string;
}

export interface DashboardStudentRef {
  studentId: string;
  fullName: string;
  classId: string;
  className: string;
}

export interface AttendanceTotals {
  attendancePercent: number | null;
  absences: number;
  justified: number;
  lessons: number;
}

export interface StudentAbsence extends DashboardStudentRef, AttendanceTotals {
  belowMinimum: boolean;
}

export interface ClassAttendance extends AttendanceTotals {
  classId: string;
  className: string;
  studentsBelowMinimum: number;
}

export interface StudentAverage extends DashboardStudentRef {
  average: number;
}

export interface StudentEvolution extends DashboardStudentRef {
  previous: number;
  current: number;
  delta: number;
}

export interface AssessmentScoreRef {
  studentId: string;
  fullName: string;
  score: number;
  normalizedScore: number;
}

export interface AssessmentSummary {
  id: string;
  title: string;
  classId: string;
  className: string;
  disciplineName: string;
  dueDate: string;
  status: AssessmentStatus;
  kind: AssessmentKind;
  maxScore: number;
  gradedCount: number;
  average: number | null;
  highest: AssessmentScoreRef | null;
  lowest: AssessmentScoreRef | null;
  histogram: number[];
}

export interface DisciplineYear {
  disciplineName: string;
  terms: TermSeries;
  annual: number | null;
}

export interface YearAverage {
  terms: TermSeries;
  annual: number | null;
}

export interface ReportCardStudent {
  studentId: string;
  fullName: string;
  registration: string;
  transferred: boolean;
  status: FinalStatus;
  disciplines: DisciplineYear[];
  overall: YearAverage;
  attendance: TermSeries;
}

export interface ReportCard {
  classId: string;
  className: string;
  disciplines: string[];
  classAverage: { disciplines: DisciplineYear[]; overall: YearAverage };
  students: ReportCardStudent[];
}

export interface ConsolidationItemOverview {
  itemId: string;
  label: string;
  answered: number;
  counts: OptionCounts;
  performance: number | null;
}

export interface ConsolidationLowPerformer extends DashboardStudentRef {
  performance: number;
}

export interface ConsolidationOverview {
  id: string;
  title: string | null;
  date: string;
  templateName: string;
  classId: string;
  className: string;
  disciplineName: string;
  scaleKind: ConsolidationScaleKind;
  options: ConsolidationScaleOption[];
  students: number;
  performance: number | null;
  items: ConsolidationItemOverview[];
  lowPerformers: ConsolidationLowPerformer[];
}

export interface TeacherDashboard {
  schoolYear: number;
  term: number;
  classes: DashboardClassOption[];
  kpis: DashboardKpis;
  statusSummary: StatusSummary;
  statusByDiscipline: DisciplineStatusSummary[];
  attendance: { classes: ClassAttendance[]; students: StudentAbsence[] };
  ranking: { best: StudentAverage[]; worst: StudentAverage[] };
  evolution: { risers: StudentEvolution[]; fallers: StudentEvolution[] };
  assessments: AssessmentSummary[];
  reportCards: ReportCard[];
  consolidations: ConsolidationOverview[];
}
