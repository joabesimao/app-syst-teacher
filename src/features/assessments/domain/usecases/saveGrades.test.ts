import { ValidationError } from "@/core/domain/errors";
import type { AssessmentRepository } from "../AssessmentRepository";
import { saveGrades } from "./saveGrades";

const makeRepository = (): jest.Mocked<AssessmentRepository> => ({
  list: jest.fn(),
  loadGrades: jest.fn(),
  saveGrades: jest.fn().mockResolvedValue(undefined),
});

const entries = [{ studentId: "1", fullName: "Ana", score: "8" }];

describe("saveGrades", () => {
  it("envia as notas válidas", async () => {
    const assessmentRepository = makeRepository();
    await saveGrades({ assessmentRepository }, { assessmentId: "a1", status: "IN_PROGRESS", maxScore: 10, entries });
    expect(assessmentRepository.saveGrades).toHaveBeenCalledWith("a1", [{ studentId: "1", score: 8 }]);
  });

  it("bloqueia avaliações fora de andamento", async () => {
    const assessmentRepository = makeRepository();
    await expect(
      saveGrades({ assessmentRepository }, { assessmentId: "a1", status: "COMPLETED", maxScore: 10, entries })
    ).rejects.toBeInstanceOf(ValidationError);
    expect(assessmentRepository.saveGrades).not.toHaveBeenCalled();
  });
});
