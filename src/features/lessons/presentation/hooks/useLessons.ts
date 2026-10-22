import { useInfiniteQuery } from "@tanstack/react-query";
import { nextPageOf } from "@/core/domain/pagination";
import { useDependencies } from "@/main/di";
import { staleTimes } from "@/shared/query/queryRoots";
import type { LessonFilters } from "../../domain/models";
import { lessonKeys } from "../queryKeys";

export function useLessons(filters: LessonFilters) {
  const { lessonRepository } = useDependencies();
  return useInfiniteQuery({
    queryKey: lessonKeys.list(filters),
    queryFn: ({ pageParam, signal }) => lessonRepository.list({ ...filters, page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    select: (data) => data.pages.flatMap((page) => page.data),
    staleTime: staleTimes.medium,
  });
}
