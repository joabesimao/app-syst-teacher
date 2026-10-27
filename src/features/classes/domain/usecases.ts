import { ValidationError } from "@/core/domain/errors";
import type { ClassRepository } from "./ClassRepository";
import type { SchoolClass, SchoolClassDraft } from "./models";

export interface CreateClassInput {
  draft: SchoolClassDraft;
  requiresDiscipline: boolean;
}

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

export async function createClass(
  { classRepository }: { classRepository: ClassRepository },
  { draft, requiresDiscipline }: CreateClassInput
): Promise<SchoolClass> {
  const name = draft.name.trim();
  const gradeLevel = draft.gradeLevel.trim();
  const disciplineName = draft.disciplineName.trim();
  const schoolYear = Number(draft.schoolYear.trim());
  if (!name) {
    throw new ValidationError("Informe o nome da turma");
  }
  if (!gradeLevel) {
    throw new ValidationError("Informe a série/ano da turma");
  }
  if (!Number.isInteger(schoolYear) || schoolYear < MIN_YEAR || schoolYear > MAX_YEAR) {
    throw new ValidationError("Ano letivo inválido");
  }
  if (requiresDiscipline && !disciplineName) {
    throw new ValidationError("Informe a disciplina que você leciona nesta turma");
  }

  return classRepository.create({
    name,
    gradeLevel,
    schoolYear,
    ...(draft.shift ? { shift: draft.shift } : {}),
    ...(disciplineName ? { disciplineName } : {}),
  });
}
