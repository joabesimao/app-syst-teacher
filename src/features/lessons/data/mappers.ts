import type { Lesson, LessonAttendance } from "../domain/models";
import type { ApiLesson, ApiLessonAttendance } from "./dto";

export const toLesson = (lesson: ApiLesson): Lesson => ({
  id: lesson.id,
  classId: lesson.classId,
  teacherId: lesson.teacherId,
  disciplineName: lesson.disciplineName,
  date: lesson.date.slice(0, 10),
  lessonCount: lesson.lessonCount,
  academicTerm: lesson.academicTerm,
  topic: lesson.topic ?? undefined,
  attendance: lesson.attendance,
});

export const toLessonAttendance = (response: ApiLessonAttendance): LessonAttendance => ({
  lesson: toLesson(response.lesson),
  students: response.students.map(({ studentId, fullName, status }) => ({ studentId, fullName, status })),
});
