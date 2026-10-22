import { OVERALL } from "./constants";
import type { ReportCard, TeacherDashboard } from "./models";
import { classYear, disciplinesFor, hasTermData, isBelowMinimumAttendance, rankingEntries, scoreLevel } from "./rules";

describe("dashboard rules", () => {
  it("classifica a média em faixas", () => {
    expect([null, 7, 6.9, 5, 4.9].map(scoreLevel)).toEqual(["none", "passing", "recovery", "recovery", "failing"]);
  });

  it("detecta frequência abaixo do mínimo", () => {
    expect(isBelowMinimumAttendance(74.9)).toBe(true);
    expect(isBelowMinimumAttendance(75)).toBe(false);
    expect(isBelowMinimumAttendance(null)).toBe(false);
  });

  it("lista as disciplinas da turma escolhida ou de todas", () => {
    const classes = [
      { id: "7A", name: "7A", gradeLevel: "7", disciplines: ["Português", "Matemática"] },
      { id: "8B", name: "8B", gradeLevel: "8", disciplines: ["Matemática", "Ciências"] },
    ];
    expect(disciplinesFor(classes)).toEqual(["Ciências", "Matemática", "Português"]);
    expect(disciplinesFor(classes, "8B")).toEqual(["Ciências", "Matemática"]);
  });

  it("usa a média geral ou a da disciplina e cai em vazio quando não acha", () => {
    const card = {
      classAverage: {
        overall: { terms: [7, null, null, null], annual: 7 },
        disciplines: [{ disciplineName: "Matemática", terms: [8, null, null, null], annual: 8 }],
      },
    } as unknown as ReportCard;
    expect(classYear(card, OVERALL).annual).toBe(7);
    expect(classYear(card, "matemática").annual).toBe(8);
    expect(classYear(card, "Artes").annual).toBeNull();
    expect(hasTermData([{ terms: [null, null, null, null] }])).toBe(false);
  });

  it("monta o ranking por média e por evolução", () => {
    const dashboard = {
      ranking: {
        best: [{ studentId: "1", classId: "7A", fullName: "Ana", className: "7A", average: 9 }],
        worst: [],
      },
      evolution: {
        risers: [{ studentId: "2", classId: "7A", fullName: "Bruno", className: "7A", previous: 5, current: 7, delta: 2 }],
        fallers: [],
      },
    } as unknown as TeacherDashboard;
    expect(rankingEntries(dashboard, "best")[0]).toMatchObject({ key: "7A:1", value: 9 });
    expect(rankingEntries(dashboard, "risers")[0]).toMatchObject({ value: 2, change: { previous: 5, current: 7 } });
  });
});
