import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { staleTimes } from "@/shared/query/queryRoots";
import type { Assessment } from "../../domain/models";
import { assessmentsOfDiscipline } from "../../domain/rules";
import { assessmentKeys } from "../queryKeys";

export function useClassAssessments(classId: string, discipline: string, teacherId?: string) {
  const { assessmentRepository } = useDependencies();
  const select = useCallback((data: Assessment[]) => assessmentsOfDiscipline(data, discipline), [discipline]);
  return useQuery({
    queryKey: assessmentKeys.list(classId, teacherId),
    queryFn: ({ signal }) => assessmentRepository.list({ classId, teacherId, signal }),
    select,
    staleTime: staleTimes.medium,
  });
}
