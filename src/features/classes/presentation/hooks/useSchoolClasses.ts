import { useInfiniteQuery } from "@tanstack/react-query";
import { nextPageOf } from "@/core/domain/pagination";
import { useDependencies } from "@/main/di";
import { staleTimes } from "@/shared/query/queryRoots";
import { classKeys } from "../queryKeys";

export function useSchoolClasses() {
  const { classRepository } = useDependencies();
  return useInfiniteQuery({
    queryKey: classKeys.list(),
    queryFn: ({ pageParam, signal }) => classRepository.list({ page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    select: (data) => data.pages.flatMap((page) => page.data),
    staleTime: staleTimes.long,
  });
}
