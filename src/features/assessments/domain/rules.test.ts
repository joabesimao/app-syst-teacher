import { ValidationError } from "@/core/domain/errors";
import type { Assessment } from "./models";
import {
  assessmentsOfDiscipline,
  canLaunchGrades,
  collectGrades,
  isAssessmentStatus,
  parseScore,
  scoreToInput,
} from "./rules";

const assessment = (id: string, discipline: string, dueDate: string): Assessment => ({
  id,
  title: id,
  classId: "c",
  discipline,
  academicTerm: 1,
  maxScore: 10,
  weight: 1,
  dueDate,
  status: "PLANNED",
});

describe("notas", () => {
  it("converte vírgula e campo vazio", () => {
    expect(parseScore("7,5")).toBe(7.5);
    expect(parseScore("  ")).toBeNull();
    expect(Number.isNaN(parseScore("abc"))).toBe(true);
    expect(scoreToInput(8.5)).toBe("8,5");
    expect(scoreToInput(null)).toBe("");
  });

  it("só permite lançar com a avaliação em andamento", () => {
    expect(canLaunchGrades("IN_PROGRESS")).toBe(true);
    expect(canLaunchGrades("PLANNED")).toBe(false);
    expect(canLaunchGrades("COMPLETED")).toBe(false);
  });

  it("valida status vindos da rota", () => {
    expect(isAssessmentStatus("COMPLETED")).toBe(true);
    expect(isAssessmentStatus("DONE")).toBe(false);
  });

  it("ignora campos vazios e coleta as notas válidas", () => {
    expect(
      collectGrades(
        [
          { studentId: "1", fullName: "Ana", score: "9,5" },
          { studentId: "2", fullName: "Bruno", score: "" },
        ],
        10
      )
    ).toEqual([{ studentId: "1", score: 9.5 }]);
  });

  it.each([
    [[{ studentId: "1", fullName: "Ana", score: "11" }], "Nota inválida para Ana"],
    [[{ studentId: "1", fullName: "Ana", score: "-1" }], "Nota inválida para Ana"],
    [[{ studentId: "1", fullName: "Ana", score: "x" }], "Nota inválida para Ana"],
    [[{ studentId: "1", fullName: "Ana", score: "" }], "Informe ao menos uma nota"],
  ])("recusa %j", (entries, message) => {
    expect(() => collectGrades(entries, 10)).toThrow(ValidationError);
    expect(() => collectGrades(entries, 10)).toThrow(message);
  });
});

describe("assessmentsOfDiscipline", () => {
  it("filtra pela disciplina e ordena pela data de entrega", () => {
    const result = assessmentsOfDiscipline(
      [
        assessment("b", "Matemática", "2026-04-10"),
        assessment("x", "Português", "2026-03-01"),
        assessment("a", " matemática", "2026-03-28"),
      ],
      "Matemática"
    );
    expect(result.map((item) => item.id)).toEqual(["a", "b"]);
  });
});
