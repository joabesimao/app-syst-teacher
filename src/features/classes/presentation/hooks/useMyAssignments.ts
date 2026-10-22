import { useQuery } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { staleTimes } from "@/shared/query/queryRoots";
import type { CurrentTeacher } from "../../domain/models";
import { activeAssignments } from "../../domain/rules";
import { classKeys } from "../queryKeys";

const selectAssignments = (teacher: CurrentTeacher | null) => ({
  linked: teacher !== null,
  assignments: teacher ? activeAssignments(teacher.assignments) : [],
});

export function useMyAssignments() {
  const { classRepository } = useDependencies();
  return useQuery({
    queryKey: classKeys.currentTeacher(),
    queryFn: ({ signal }) => classRepository.loadCurrentTeacher(signal),
    select: selectAssignments,
    staleTime: staleTimes.long,
  });
}
