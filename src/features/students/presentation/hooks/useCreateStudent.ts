import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { queryRoots } from "@/shared/query/queryRoots";
import type { CreateStudentInput } from "../../domain/usecases";
import { createStudent } from "../../domain/usecases";
import { studentKeys } from "../queryKeys";

export function useCreateStudent() {
  const dependencies = useDependencies();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStudentInput) => createStudent(dependencies, input),
    onSuccess: (_, { classId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: studentKeys.byClass(classId) }),
        queryClient.invalidateQueries({ queryKey: [queryRoots.dashboard] }),
      ]),
  });
}
