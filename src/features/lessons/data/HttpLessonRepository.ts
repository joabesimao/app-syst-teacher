import type { Page } from "@/core/domain/pagination";
import type { ApiPage } from "@/core/http/ApiPage";
import type { HttpClient } from "@/core/http/HttpClient";
import { PAGE_SIZE } from "@/shared/query/queryRoots";
import type { LessonRepository, ListLessonsParams } from "../domain/LessonRepository";
import type { AttendanceRecord, Lesson, LessonAttendance, LessonChanges, NewLesson } from "../domain/models";
import type { ApiLesson, ApiLessonAttendance } from "./dto";
import { toLesson, toLessonAttendance } from "./mappers";

export class HttpLessonRepository implements LessonRepository {
  constructor(private readonly http: HttpClient) {}

  async list({ classId, teacherId, disciplineName, page, signal }: ListLessonsParams): Promise<Page<Lesson>> {
    const response = await this.http.get<ApiPage<ApiLesson>>("/lessons", {
      query: { classId, teacherId, disciplineName, page, limit: PAGE_SIZE },
      signal,
    });
    return { ...response, data: response.data.map(toLesson) };
  }

  async loadAttendance(lessonId: string, signal?: AbortSignal): Promise<LessonAttendance> {
    return toLessonAttendance(await this.http.get<ApiLessonAttendance>(`/lessons/${lessonId}`, { signal }));
  }

  async create(lesson: NewLesson): Promise<void> {
    await this.http.post("/lessons", lesson);
  }

  async update(lessonId: string, changes: LessonChanges): Promise<void> {
    await this.http.patch(`/lessons/${lessonId}`, changes);
  }

  async saveAttendance(lessonId: string, records: AttendanceRecord[]): Promise<void> {
    await this.http.put(`/lessons/${lessonId}/attendance`, { records });
  }
}
