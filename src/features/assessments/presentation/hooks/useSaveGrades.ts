import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { queryRoots } from "@/shared/query/queryRoots";
import type { SaveGradesInput } from "../../domain/usecases";
import { saveGrades } from "../../domain/usecases";

export function useSaveGrades() {
  const dependencies = useDependencies();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveGradesInput) => saveGrades(dependencies, input),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [queryRoots.assessments] }),
        queryClient.invalidateQueries({ queryKey: [queryRoots.dashboard] }),
      ]),
  });
}
