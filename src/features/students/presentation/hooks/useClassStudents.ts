import { useInfiniteQuery } from "@tanstack/react-query";
import { nextPageOf } from "@/core/domain/pagination";
import { useDependencies } from "@/main/di";
import { staleTimes } from "@/shared/query/queryRoots";
import { studentKeys } from "../queryKeys";

export function useClassStudents(classId: string) {
  const { studentRepository } = useDependencies();
  return useInfiniteQuery({
    queryKey: studentKeys.byClass(classId),
    queryFn: ({ pageParam, signal }) => studentRepository.listByClass({ classId, page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    select: (data) => data.pages.flatMap((page) => page.data),
    staleTime: staleTimes.long,
  });
}
