import type { Page } from "@/core/domain/pagination";
import type { CurrentTeacher, NewSchoolClass, SchoolClass } from "./models";

export interface ListClassesParams {
  page: number;
  signal?: AbortSignal;
}

export interface ClassRepository {
  loadCurrentTeacher(signal?: AbortSignal): Promise<CurrentTeacher | null>;
  list(params: ListClassesParams): Promise<Page<SchoolClass>>;
  create(schoolClass: NewSchoolClass): Promise<SchoolClass>;
}
