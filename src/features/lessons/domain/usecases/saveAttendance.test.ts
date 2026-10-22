import { ValidationError } from "@/core/domain/errors";
import type { LessonRepository } from "../LessonRepository";
import type { AttendanceDraft } from "../models";
import { saveAttendance } from "./saveAttendance";

const draft: AttendanceDraft = {
  date: "2026-03-09",
  lessonCount: 2,
  topic: "  Frações ",
  rows: [
    { studentId: "1", fullName: "Ana", status: "PRESENT" },
    { studentId: "2", fullName: "Bruno", status: "ABSENT" },
  ],
};

const makeRepository = (): jest.Mocked<LessonRepository> => ({
  list: jest.fn(),
  loadAttendance: jest.fn(),
  create: jest.fn().mockResolvedValue(undefined),
  update: jest.fn().mockResolvedValue(undefined),
  saveAttendance: jest.fn().mockResolvedValue(undefined),
});

const base = { classId: "c1", disciplineName: "Matemática", teacherId: "t1" };

describe("saveAttendance", () => {
  it("cria a aula com os registros quando é uma chamada nova", async () => {
    const lessonRepository = makeRepository();
    await saveAttendance({ lessonRepository }, { ...base, draft });
    expect(lessonRepository.create).toHaveBeenCalledWith({
      classId: "c1",
      teacherId: "t1",
      disciplineName: "Matemática",
      date: "2026-03-09",
      lessonCount: 2,
      topic: "Frações",
      records: [
        { studentId: "1", status: "PRESENT" },
        { studentId: "2", status: "ABSENT" },
      ],
    });
    expect(lessonRepository.update).not.toHaveBeenCalled();
  });

  it("atualiza a aula e a presença quando edita uma chamada", async () => {
    const lessonRepository = makeRepository();
    await saveAttendance({ lessonRepository }, { ...base, lessonId: "l1", draft: { ...draft, topic: " " } });
    expect(lessonRepository.update).toHaveBeenCalledWith("l1", {
      date: "2026-03-09",
      lessonCount: 2,
      topic: undefined,
    });
    expect(lessonRepository.saveAttendance).toHaveBeenCalledWith("l1", expect.any(Array));
    expect(lessonRepository.create).not.toHaveBeenCalled();
  });

  it.each([
    ["data inválida", { ...base, draft: { ...draft, date: "2026-02-31" } }, "Data inválida"],
    ["sem professor", { ...base, teacherId: undefined, draft }, "Não há alunos"],
    ["sem alunos", { ...base, draft: { ...draft, rows: [] } }, "Não há alunos"],
    ["aulas demais", { ...base, draft: { ...draft, lessonCount: 11 } }, "quantidade de aulas"],
  ])("recusa %s", async (_case, input, message) => {
    const lessonRepository = makeRepository();
    const result = saveAttendance({ lessonRepository }, input);
    await expect(result).rejects.toBeInstanceOf(ValidationError);
    await expect(result).rejects.toThrow(message);
    expect(lessonRepository.create).not.toHaveBeenCalled();
  });
});
