import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { queryRoots } from "@/shared/query/queryRoots";
import type { SaveAttendanceInput } from "../../domain/usecases";
import { saveAttendance } from "../../domain/usecases";
import { lessonKeys } from "../queryKeys";

export function useSaveAttendance() {
  const dependencies = useDependencies();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveAttendanceInput) => saveAttendance(dependencies, input),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: lessonKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: [queryRoots.dashboard] }),
      ]),
  });
}
