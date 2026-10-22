import type { StudentRepository } from "@/features/students/domain/StudentRepository";
import { todayIso } from "@/shared/format";
import type { LessonRepository } from "../LessonRepository";
import type { AttendanceDraft } from "../models";
import { draftFromLesson, draftFromStudents } from "../rules";

interface Deps {
  lessonRepository: LessonRepository;
  studentRepository: StudentRepository;
}

interface Params {
  classId: string;
  lessonId?: string;
  signal?: AbortSignal;
}

export async function loadAttendanceDraft(
  { lessonRepository, studentRepository }: Deps,
  { classId, lessonId, signal }: Params
): Promise<AttendanceDraft> {
  if (lessonId) {
    return draftFromLesson(await lessonRepository.loadAttendance(lessonId, signal));
  }
  return draftFromStudents(await studentRepository.listAllByClass(classId, signal), todayIso());
}
