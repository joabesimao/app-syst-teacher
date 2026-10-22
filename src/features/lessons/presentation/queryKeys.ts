import { queryRoots } from "@/shared/query/queryRoots";
import type { LessonFilters } from "../domain/models";

export const lessonKeys = {
  all: [queryRoots.lessons] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  list: (filters: LessonFilters) => [...lessonKeys.lists(), filters] as const,
  draft: (classId: string, lessonId?: string) => [...lessonKeys.all, "draft", classId, lessonId ?? "new"] as const,
};
