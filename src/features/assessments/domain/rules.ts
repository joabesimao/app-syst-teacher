import { ValidationError } from "@/core/domain/errors";
import { formatNumber, sameText } from "@/shared/format";
import type { Assessment, AssessmentStatus, GradeEntry, GradeInput } from "./models";

const STATUSES: readonly AssessmentStatus[] = ["PLANNED", "IN_PROGRESS", "COMPLETED"];

export const isAssessmentStatus = (value: string): value is AssessmentStatus =>
  (STATUSES as readonly string[]).includes(value);

export const canLaunchGrades = (status: AssessmentStatus) => status === "IN_PROGRESS";

export const parseScore = (value: string): number | null => {
  const normalized = value.replace(",", ".").trim();
  return normalized === "" ? null : Number(normalized);
};

export const scoreToInput = (score: number | null) => (score === null ? "" : String(score).replace(".", ","));

export const isPositiveNumber = (value: number | null): value is number =>
  value !== null && Number.isFinite(value) && value > 0;

export const MIN_TITLE_LENGTH = 3;

export const isValidScore = (score: number, maxScore: number) =>
  Number.isFinite(score) && score >= 0 && score <= maxScore;

export const assessmentsOfDiscipline = (assessments: Assessment[], discipline: string) =>
  assessments
    .filter((assessment) => sameText(assessment.discipline, discipline))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

export function collectGrades(entries: GradeEntry[], maxScore: number): GradeInput[] {
  const grades: GradeInput[] = [];
  for (const entry of entries) {
    const score = parseScore(entry.score);
    if (score === null) continue;
    if (!isValidScore(score, maxScore)) {
      throw new ValidationError(
        `Nota inválida para ${entry.fullName}. Use um valor entre 0 e ${formatNumber(maxScore)}`
      );
    }
    grades.push({ studentId: entry.studentId, score });
  }
  if (grades.length === 0) {
    throw new ValidationError("Informe ao menos uma nota");
  }
  return grades;
}
