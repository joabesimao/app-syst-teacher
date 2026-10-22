import { queryRoots } from "@/shared/query/queryRoots";

export const studentKeys = {
  all: [queryRoots.students] as const,
  byClass: (classId: string) => [...studentKeys.all, "class", classId] as const,
};
