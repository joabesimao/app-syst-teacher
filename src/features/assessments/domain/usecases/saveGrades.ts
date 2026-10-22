import { ValidationError } from "@/core/domain/errors";
import type { AssessmentRepository } from "../AssessmentRepository";
import type { AssessmentStatus, GradeEntry } from "../models";
import { canLaunchGrades, collectGrades } from "../rules";

export interface SaveGradesInput {
  assessmentId: string;
  status: AssessmentStatus;
  maxScore: number;
  entries: GradeEntry[];
}

export const GRADES_LOCKED_MESSAGE =
  "As notas só podem ser lançadas com a avaliação Em andamento. Altere o status pelo sistema web.";

export async function saveGrades(
  { assessmentRepository }: { assessmentRepository: AssessmentRepository },
  { assessmentId, status, maxScore, entries }: SaveGradesInput
): Promise<void> {
  if (!canLaunchGrades(status)) {
    throw new ValidationError(GRADES_LOCKED_MESSAGE);
  }
  await assessmentRepository.saveGrades(assessmentId, collectGrades(entries, maxScore));
}
