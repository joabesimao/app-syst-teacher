import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import type { CreateClassInput } from "../../domain/usecases";
import { createClass } from "../../domain/usecases";
import { classKeys } from "../queryKeys";

export function useCreateClass() {
  const dependencies = useDependencies();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateClassInput) => createClass(dependencies, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: classKeys.all }),
  });
}
