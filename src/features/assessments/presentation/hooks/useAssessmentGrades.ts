import { useQuery } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { assessmentKeys } from "../queryKeys";

export function useAssessmentGrades(assessmentId: string | undefined, classId: string | undefined) {
  const { assessmentRepository } = useDependencies();
  return useQuery({
    queryKey: assessmentKeys.grades(assessmentId ?? "", classId ?? ""),
    queryFn: ({ signal }) => assessmentRepository.loadGrades(assessmentId ?? "", classId ?? "", signal),
    enabled: !!assessmentId && !!classId,
    staleTime: 0,
    gcTime: 0,
  });
}
