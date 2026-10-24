import { useQuery } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { consolidationKeys } from "../queryKeys";

export function useConsolidationSheet(consolidationId: string | undefined) {
  const { consolidationRepository } = useDependencies();
  return useQuery({
    queryKey: consolidationKeys.sheet(consolidationId ?? ""),
    queryFn: ({ signal }) => consolidationRepository.loadSheet(consolidationId ?? "", signal),
    enabled: !!consolidationId,
    staleTime: 0,
  });
}
