import { ValidationError } from "@/core/domain/errors";
import { isValidDay } from "@/shared/format";
import type { AssessmentRepository } from "../AssessmentRepository";
import type { Assessment, AssessmentDraft } from "../models";
import { isPositiveNumber, MIN_TITLE_LENGTH, parseScore } from "../rules";

export interface CreateAssessmentInput {
  classId: string;
  disciplineName: string;
  teacherId?: string;
  draft: AssessmentDraft;
}

export async function createAssessment(
  { assessmentRepository }: { assessmentRepository: AssessmentRepository },
  { classId, disciplineName, teacherId, draft }: CreateAssessmentInput
): Promise<Assessment> {
  const title = draft.title.trim();
  if (title.length < MIN_TITLE_LENGTH) {
    throw new ValidationError(`Informe um título com ao menos ${MIN_TITLE_LENGTH} letras`);
  }
  if (!isValidDay(draft.dueDate)) {
    throw new ValidationError("Data de entrega inválida. Use o formato AAAA-MM-DD");
  }
  const maxScore = parseScore(draft.maxScore);
  if (!isPositiveNumber(maxScore)) {
    throw new ValidationError("A nota máxima deve ser maior que zero");
  }
  const recovery = draft.kind === "RECOVERY";
  const weight = recovery ? 1 : parseScore(draft.weight);
  if (!isPositiveNumber(weight)) {
    throw new ValidationError("O peso deve ser maior que zero");
  }
  if (!teacherId) {
    throw new ValidationError("Sua conta não está vinculada a um professor");
  }

  return assessmentRepository.create({
    title,
    classId,
    teacherId,
    disciplineName,
    maxScore,
    weight,
    dueDate: draft.dueDate,
    status: draft.status,
    kind: draft.kind,
  });
}
