import type { CurrentTeacher } from "./models";

export interface ClassRepository {
  loadCurrentTeacher(signal?: AbortSignal): Promise<CurrentTeacher | null>;
}
