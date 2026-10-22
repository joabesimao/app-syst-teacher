import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { queryRoots } from "@/shared/query/queryRoots";
import type { CreateAssessmentInput } from "../../domain/usecases";
import { createAssessment } from "../../domain/usecases";
import { assessmentKeys } from "../queryKeys";

export function useCreateAssessment() {
  const dependencies = useDependencies();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAssessmentInput) => createAssessment(dependencies, input),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: [queryRoots.dashboard] }),
      ]),
  });
}
