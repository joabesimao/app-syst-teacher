import type { Page } from "@/core/domain/pagination";
import type { Student } from "./models";

export interface ListStudentsParams {
  classId: string;
  page: number;
  signal?: AbortSignal;
}

export interface StudentRepository {
  listByClass(params: ListStudentsParams): Promise<Page<Student>>;
  listAllByClass(classId: string, signal?: AbortSignal): Promise<Student[]>;
}
