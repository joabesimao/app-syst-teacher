import type { CurrentTeacher, SchoolClass, SchoolShift } from "../domain/models";
import type { ApiClass, ApiCurrentUser } from "./dto";

export const toSchoolClass = (apiClass: ApiClass): SchoolClass => ({
  id: apiClass.id,
  name: apiClass.name,
  gradeLevel: apiClass.gradeLevel,
  schoolYear: apiClass.schoolYear,
  shift: (apiClass.shift as SchoolShift | null | undefined) ?? null,
  isActive: apiClass.isActive,
});

export const toCurrentTeacher = ({ teacher }: ApiCurrentUser): CurrentTeacher | null =>
  teacher
    ? {
        id: teacher.id,
        fullName: teacher.fullName,
        assignments: teacher.assignments.map((assignment) => ({
          classId: assignment.classId,
          disciplineName: assignment.disciplineName,
          schoolClass: toSchoolClass(assignment.schoolClass),
        })),
      }
    : null;
