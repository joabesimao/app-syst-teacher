import { ValidationError } from "@/core/domain/errors";
import type { LessonRepository } from "../LessonRepository";
import type { AttendanceDraft } from "../models";
import { isValidDay, isValidLessonCount, LESSON_COUNT_LIMITS } from "../rules";

export interface SaveAttendanceInput {
  classId: string;
  disciplineName: string;
  teacherId?: string;
  lessonId?: string;
  draft: AttendanceDraft;
}

export async function saveAttendance(
  { lessonRepository }: { lessonRepository: LessonRepository },
  { classId, disciplineName, teacherId, lessonId, draft }: SaveAttendanceInput
): Promise<void> {
  if (!isValidDay(draft.date)) {
    throw new ValidationError("Data inválida. Use o formato AAAA-MM-DD");
  }
  if (!isValidLessonCount(draft.lessonCount)) {
    throw new ValidationError(
      `A quantidade de aulas deve ficar entre ${LESSON_COUNT_LIMITS.min} e ${LESSON_COUNT_LIMITS.max}`
    );
  }
  if (!teacherId || draft.rows.length === 0) {
    throw new ValidationError("Não há alunos para registrar");
  }

  const records = draft.rows.map(({ studentId, status }) => ({ studentId, status }));
  const topic = draft.topic.trim() || undefined;

  if (lessonId) {
    await lessonRepository.update(lessonId, { date: draft.date, lessonCount: draft.lessonCount, topic });
    await lessonRepository.saveAttendance(lessonId, records);
    return;
  }

  await lessonRepository.create({
    classId,
    teacherId,
    disciplineName,
    date: draft.date,
    lessonCount: draft.lessonCount,
    topic,
    records,
  });
}
