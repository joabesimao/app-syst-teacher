import { useQuery } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { staleTimes } from "@/shared/query/queryRoots";
import { consolidationKeys } from "../queryKeys";

export function useConsolidations(classId?: string, disciplineName?: string) {
  const { consolidationRepository } = useDependencies();
  return useQuery({
    queryKey: consolidationKeys.list(classId, disciplineName),
    queryFn: ({ signal }) => consolidationRepository.list({ classId, disciplineName, signal }),
    staleTime: staleTimes.medium,
  });
}
