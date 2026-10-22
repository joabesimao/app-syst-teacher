import { queryRoots } from "@/shared/query/queryRoots";

export const assessmentKeys = {
  all: [queryRoots.assessments] as const,
  lists: () => [...assessmentKeys.all, "list"] as const,
  list: (classId: string, teacherId?: string) => [...assessmentKeys.lists(), { classId, teacherId }] as const,
  grades: (assessmentId: string, classId: string) => [...assessmentKeys.all, "grades", assessmentId, classId] as const,
};
