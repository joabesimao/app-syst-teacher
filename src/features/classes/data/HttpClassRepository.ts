import type { Page } from "@/core/domain/pagination";
import type { ApiPage } from "@/core/http/ApiPage";
import type { HttpClient } from "@/core/http/HttpClient";
import { PAGE_SIZE } from "@/shared/query/queryRoots";
import type { ClassRepository, ListClassesParams } from "../domain/ClassRepository";
import type { CurrentTeacher, NewSchoolClass, SchoolClass } from "../domain/models";
import type { ApiClass, ApiCurrentUser } from "./dto";
import { toCurrentTeacher, toSchoolClass } from "./mappers";

export class HttpClassRepository implements ClassRepository {
  constructor(private readonly http: HttpClient) {}

  async loadCurrentTeacher(signal?: AbortSignal): Promise<CurrentTeacher | null> {
    return toCurrentTeacher(await this.http.get<ApiCurrentUser>("/auth/me", { signal }));
  }

  async list({ page, signal }: ListClassesParams): Promise<Page<SchoolClass>> {
    const response = await this.http.get<ApiPage<ApiClass>>("/classes", {
      query: { page, limit: PAGE_SIZE, isActive: true },
      signal,
    });
    return { ...response, data: response.data.map(toSchoolClass) };
  }

  async create(schoolClass: NewSchoolClass): Promise<SchoolClass> {
    return toSchoolClass(await this.http.post<ApiClass>("/classes", schoolClass));
  }
}
