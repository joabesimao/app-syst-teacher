import type { Page } from "@/core/domain/pagination";
import type { AttendanceRecord, Lesson, LessonAttendance, LessonChanges, LessonFilters, NewLesson } from "./models";

export interface ListLessonsParams extends LessonFilters {
  page: number;
  signal?: AbortSignal;
}

export interface LessonRepository {
  list(params: ListLessonsParams): Promise<Page<Lesson>>;
  loadAttendance(lessonId: string, signal?: AbortSignal): Promise<LessonAttendance>;
  create(lesson: NewLesson): Promise<void>;
  update(lessonId: string, changes: LessonChanges): Promise<void>;
  saveAttendance(lessonId: string, records: AttendanceRecord[]): Promise<void>;
}
