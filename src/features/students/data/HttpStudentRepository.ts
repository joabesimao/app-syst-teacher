import type { Page } from "@/core/domain/pagination";
import type { ApiPage } from "@/core/http/ApiPage";
import type { HttpClient } from "@/core/http/HttpClient";
import { PAGE_SIZE } from "@/shared/query/queryRoots";
import type { NewStudent, Student } from "../domain/models";
import type { ListStudentsParams, StudentRepository } from "../domain/StudentRepository";
import type { ApiStudent } from "./dto";
import { toStudent } from "./mappers";

const MAX_PAGE_SIZE = 100;

export class HttpStudentRepository implements StudentRepository {
  constructor(private readonly http: HttpClient) {}

  async listByClass({ classId, page, signal }: ListStudentsParams): Promise<Page<Student>> {
    return this.fetchPage(classId, page, PAGE_SIZE, signal);
  }

  async listAllByClass(classId: string, signal?: AbortSignal): Promise<Student[]> {
    const first = await this.fetchPage(classId, 1, MAX_PAGE_SIZE, signal);
    const rest = await Promise.all(
      Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, index) =>
        this.fetchPage(classId, index + 2, MAX_PAGE_SIZE, signal)
      )
    );
    return [first, ...rest].flatMap((page) => page.data);
  }

  async create(student: NewStudent): Promise<Student> {
    return toStudent(await this.http.post<ApiStudent>("/students", student));
  }

  private async fetchPage(classId: string, page: number, limit: number, signal?: AbortSignal) {
    const response = await this.http.get<ApiPage<ApiStudent>>("/students", {
      query: { classId, page, limit },
      signal,
    });
    return { ...response, data: response.data.map(toStudent) };
  }
}
