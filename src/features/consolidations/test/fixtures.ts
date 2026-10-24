import type { ConsolidationSheet, ConsolidationTemplate } from "../domain/models";

export const right = {
  id: "o1",
  label: "Acertou",
  summaryLabel: "Acertos",
  color: "#2E7D32",
  icon: "🟩",
  value: 1,
  position: 0,
};
export const wrong = {
  id: "o2",
  label: "Errou",
  summaryLabel: "Erros",
  color: "#C62828",
  icon: "🟥",
  value: 0,
  position: 1,
};

export const items = [
  { id: "i1", label: "Adição", position: 0 },
  { id: "i2", label: "Subtração", position: 1 },
];

export const template: ConsolidationTemplate = {
  id: "t1",
  name: "Quatro operações",
  description: null,
  disciplineName: "Matematica",
  gradeLevel: null,
  ownerTeacherId: null,
  isActive: true,
  locked: false,
  items,
  options: [right, wrong],
};

export const makeSheet = (status: "IN_PROGRESS" | "COMPLETED" = "IN_PROGRESS"): ConsolidationSheet => ({
  consolidation: {
    id: "c1",
    title: null,
    date: "2026-03-10",
    academicTerm: 1,
    status,
    disciplineName: "Matematica",
  },
  schoolName: "E.M.E.B Professora Verônica",
  schoolClass: { id: "class-1", name: "7A", gradeLevel: "7º ano", schoolYear: 2026 },
  teacherName: "Delvangela",
  template: { id: "t1", name: "Quatro operações", scaleKind: "SCORED", items, options: [right, wrong] },
  students: [
    { studentId: "s1", fullName: "Ana Souza", registration: "2026001", transferred: false, responses: { i1: "o1", i2: "o2" } },
    { studentId: "s2", fullName: "Bruno Lima", registration: "2026002", transferred: false, responses: { i1: null, i2: null } },
  ],
  summary: {
    scaleKind: "SCORED",
    students: [
      { studentId: "s1", answered: 2, complete: true, counts: { o1: 1, o2: 1 }, performance: 50 },
      { studentId: "s2", answered: 0, complete: false, counts: { o1: 0, o2: 0 }, performance: null },
    ],
    items: [
      { itemId: "i1", answered: 1, counts: { o1: 1, o2: 0 }, performance: 100 },
      { itemId: "i2", answered: 1, counts: { o1: 0, o2: 1 }, performance: 0 },
    ],
    total: { answered: 2, expected: 4, counts: { o1: 1, o2: 1 }, performance: 50 },
  },
});
