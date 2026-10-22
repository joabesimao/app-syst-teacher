import { useQuery } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { loadAttendanceDraft } from "../../domain/usecases";
import { lessonKeys } from "../queryKeys";

export function useAttendanceDraft(classId: string | undefined, lessonId?: string) {
  const dependencies = useDependencies();
  return useQuery({
    queryKey: lessonKeys.draft(classId ?? "", lessonId),
    queryFn: ({ signal }) => loadAttendanceDraft(dependencies, { classId: classId ?? "", lessonId, signal }),
    enabled: !!classId,
    staleTime: 0,
    gcTime: 0,
  });
}
