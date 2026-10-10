import type {
  AssessmentStatus,
  AttendanceStatus,
  FinalStatus,
  SchoolClass,
  SchoolShift,
  TeacherAssignment,
} from "../types/domain";

type ChipColor = "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";

export const TERMS = ["1", "2", "3", "4"] as const;

export const termLabel = (term: string | number) => `${term}º Bimestre`;

export const SHIFT_LABELS: Record<SchoolShift, string> = {
  MORNING: "Manhã",
  AFTERNOON: "Tarde",
  EVENING: "Noite",
  FULL_TIME: "Integral",
};

export const ASSESSMENT_STATUS: Record<AssessmentStatus, { label: string; color: ChipColor }> = {
  PLANNED: { label: "Planejada", color: "default" },
  IN_PROGRESS: { label: "Em andamento", color: "info" },
  COMPLETED: { label: "Concluída", color: "success" },
};

export const FINAL_STATUS: Record<FinalStatus, { label: string; color: ChipColor }> = {
  APPROVED: { label: "Aprovado", color: "success" },
  RECOVERY: { label: "Recuperação", color: "warning" },
  FAILED: { label: "Reprovado", color: "error" },
  NO_GRADES: { label: "Sem notas", color: "default" },
};

export const ATTENDANCE_STATUS: Record<AttendanceStatus, { label: string; short: string }> = {
  PRESENT: { label: "Presente", short: "P" },
  ABSENT: { label: "Falta", short: "F" },
  JUSTIFIED: { label: "Justificada", short: "J" },
};

export const classLabel = (schoolClass?: SchoolClass) =>
  schoolClass ? `${schoolClass.name} · ${schoolClass.gradeLevel} (${schoolClass.schoolYear})` : "-";

export const formatDate = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
};

export const formatNumber = (value: number | null | undefined, suffix = "") =>
  value === null || value === undefined
    ? "-"
    : `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}${suffix}`;

export const todayIso = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("-");
};

const normalize = (value: string) => value.trim().toLowerCase();

export const sameDiscipline = (a: string, b: string) => normalize(a) === normalize(b);

export const disciplinesOfClass = (
  assignmentsByTeacher: { assignments: TeacherAssignment[] }[],
  classId: string
) => {
  const byKey = new Map<string, string>();
  for (const teacher of assignmentsByTeacher) {
    for (const assignment of teacher.assignments) {
      if (assignment.classId === classId && !byKey.has(normalize(assignment.disciplineName))) {
        byKey.set(normalize(assignment.disciplineName), assignment.disciplineName);
      }
    }
  }
  return [...byKey.values()].sort((a, b) => a.localeCompare(b, "pt-BR"));
};
