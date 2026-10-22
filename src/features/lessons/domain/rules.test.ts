import { countByStatus, draftFromLesson, draftFromStudents, isValidDay, isValidLessonCount } from "./rules";

describe("isValidDay", () => {
  it.each([
    ["2026-03-09", true],
    ["2024-02-29", true],
    ["2026-02-30", false],
    ["2026-13-01", false],
    ["09/03/2026", false],
    ["2026-3-9", false],
  ])("%s → %s", (value, expected) => {
    expect(isValidDay(value)).toBe(expected);
  });
});

describe("isValidLessonCount", () => {
  it("aceita de 1 a 10 aulas inteiras", () => {
    expect([0, 1, 10, 11, 1.5].map(isValidLessonCount)).toEqual([false, true, true, false, false]);
  });
});

describe("drafts", () => {
  it("monta a chamada nova só com alunos ativos, todos presentes e em ordem alfabética", () => {
    const draft = draftFromStudents(
      [
        { id: "2", fullName: "Bruno", registration: "2", classId: "c", isActive: true },
        { id: "1", fullName: "Ana", registration: "1", classId: "c", isActive: true },
        { id: "3", fullName: "Carla", registration: "3", classId: "c", isActive: false },
      ],
      "2026-03-09"
    );
    expect(draft).toEqual({
      date: "2026-03-09",
      lessonCount: 1,
      topic: "",
      rows: [
        { studentId: "1", fullName: "Ana", status: "PRESENT" },
        { studentId: "2", fullName: "Bruno", status: "PRESENT" },
      ],
    });
  });

  it("carrega a chamada existente e marca presente quem está sem registro", () => {
    const draft = draftFromLesson({
      lesson: {
        id: "l1",
        classId: "c",
        teacherId: "t",
        disciplineName: "Matemática",
        date: "2026-03-02",
        lessonCount: 2,
        academicTerm: 1,
      },
      students: [
        { studentId: "2", fullName: "Bruno", status: "ABSENT" },
        { studentId: "1", fullName: "Ana", status: null },
      ],
    });
    expect(draft.topic).toBe("");
    expect(draft.rows).toEqual([
      { studentId: "1", fullName: "Ana", status: "PRESENT" },
      { studentId: "2", fullName: "Bruno", status: "ABSENT" },
    ]);
  });
});

describe("countByStatus", () => {
  it("conta presenças, faltas e justificadas", () => {
    expect(countByStatus(["PRESENT", "ABSENT", "PRESENT", "JUSTIFIED"])).toEqual({
      PRESENT: 2,
      ABSENT: 1,
      JUSTIFIED: 1,
    });
  });
});
