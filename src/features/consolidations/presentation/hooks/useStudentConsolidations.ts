import { useQuery } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { staleTimes } from "@/shared/query/queryRoots";
import { consolidationKeys } from "../queryKeys";

export function useStudentConsolidations(studentId: string | undefined) {
  const { consolidationRepository } = useDependencies();
  return useQuery({
    queryKey: consolidationKeys.student(studentId ?? ""),
    queryFn: ({ signal }) => consolidationRepository.listByStudent(studentId ?? "", signal),
    enabled: !!studentId,
    staleTime: staleTimes.medium,
  });
}
