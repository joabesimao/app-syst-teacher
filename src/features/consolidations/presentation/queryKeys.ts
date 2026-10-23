import { queryRoots } from "@/shared/query/queryRoots";
import type { ConsolidationTemplateScope } from "../domain/models";

export const consolidationKeys = {
  all: [queryRoots.consolidations] as const,
  lists: () => [...consolidationKeys.all, "list"] as const,
  list: (classId?: string, disciplineName?: string) =>
    [...consolidationKeys.lists(), { classId, disciplineName }] as const,
  templates: (scope?: ConsolidationTemplateScope) => [...consolidationKeys.all, "templates", { scope }] as const,
  sheet: (consolidationId: string) => [...consolidationKeys.all, "sheet", consolidationId] as const,
  student: (studentId: string) => [...consolidationKeys.all, "student", studentId] as const,
};
