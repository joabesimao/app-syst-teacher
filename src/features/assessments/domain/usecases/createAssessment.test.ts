import { ValidationError } from "@/core/domain/errors";
import type { AssessmentRepository } from "../AssessmentRepository";
import type { AssessmentDraft } from "../models";
import { createAssessment } from "./createAssessment";

const draft: AssessmentDraft = {
  title: "  Prova 1 ",
  kind: "REGULAR",
  dueDate: "2026-10-22",
  maxScore: "10",
  weight: "1,5",
  status: "IN_PROGRESS",
};

const makeRepository = (): jest.Mocked<AssessmentRepository> => ({
  list: jest.fn(),
  create: jest.fn().mockImplementation(async (assessment) => ({ ...assessment, id: "a1" })),
  loadGrades: jest.fn(),
  saveGrades: jest.fn(),
});

const base = { classId: "c1", disciplineName: "Matemática", teacherId: "t1" };

describe("createAssessment", () => {
  it("cria a avaliação em nome do professor, com título limpo e números convertidos", async () => {
    const assessmentRepository = makeRepository();
    await createAssessment({ assessmentRepository }, { ...base, draft });
    expect(assessmentRepository.create).toHaveBeenCalledWith({
      title: "Prova 1",
      classId: "c1",
      teacherId: "t1",
      disciplineName: "Matemática",
      maxScore: 10,
      weight: 1.5,
      dueDate: "2026-10-22",
      status: "IN_PROGRESS",
      kind: "REGULAR",
    });
  });

  it("usa peso 1 na recuperação, ignorando o peso digitado", async () => {
    const assessmentRepository = makeRepository();
    await createAssessment({ assessmentRepository }, { ...base, draft: { ...draft, kind: "RECOVERY", weight: "" } });
    expect(assessmentRepository.create).toHaveBeenCalledWith(expect.objectContaining({ kind: "RECOVERY", weight: 1 }));
  });

  it.each([
    ["título curto", { ...base, draft: { ...draft, title: " P " } }, "título"],
    ["data inválida", { ...base, draft: { ...draft, dueDate: "22/10/2026" } }, "Data de entrega inválida"],
    ["nota máxima zero", { ...base, draft: { ...draft, maxScore: "0" } }, "nota máxima"],
    ["nota máxima vazia", { ...base, draft: { ...draft, maxScore: "" } }, "nota máxima"],
    ["peso inválido", { ...base, draft: { ...draft, weight: "abc" } }, "peso"],
    ["sem professor", { ...base, teacherId: undefined, draft }, "vinculada a um professor"],
  ])("recusa %s", async (_case, input, message) => {
    const assessmentRepository = makeRepository();
    const result = createAssessment({ assessmentRepository }, input);
    await expect(result).rejects.toBeInstanceOf(ValidationError);
    await expect(result).rejects.toThrow(message);
    expect(assessmentRepository.create).not.toHaveBeenCalled();
  });
});
