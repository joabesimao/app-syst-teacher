import type { HttpClient } from "@/core/http/HttpClient";
import type { ClassRepository } from "../domain/ClassRepository";
import type { CurrentTeacher } from "../domain/models";
import type { ApiCurrentUser } from "./dto";
import { toCurrentTeacher } from "./mappers";

export class HttpClassRepository implements ClassRepository {
  constructor(private readonly http: HttpClient) {}

  async loadCurrentTeacher(signal?: AbortSignal): Promise<CurrentTeacher | null> {
    return toCurrentTeacher(await this.http.get<ApiCurrentUser>("/auth/me", { signal }));
  }
}
