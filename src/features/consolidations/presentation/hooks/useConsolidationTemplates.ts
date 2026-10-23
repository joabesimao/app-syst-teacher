import { useQuery } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { staleTimes } from "@/shared/query/queryRoots";
import type { ConsolidationTemplateScope } from "../../domain/models";
import { consolidationKeys } from "../queryKeys";

export function useConsolidationTemplates(scope?: ConsolidationTemplateScope) {
  const { consolidationRepository } = useDependencies();
  return useQuery({
    queryKey: consolidationKeys.templates(scope),
    queryFn: ({ signal }) => consolidationRepository.listTemplates({ scope, signal }),
    staleTime: staleTimes.long,
  });
}
