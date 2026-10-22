import { queryRoots } from "@/shared/query/queryRoots";

export const classKeys = {
  all: [queryRoots.classes] as const,
  currentTeacher: () => [...classKeys.all, "current-teacher"] as const,
};
