import { byText } from "@/shared/format";
import type { TeacherAssignment } from "./models";

export const assignmentKey = (assignment: TeacherAssignment) =>
  `${assignment.classId}:${assignment.disciplineName}`;

export const activeAssignments = (assignments: TeacherAssignment[]) =>
  assignments
    .filter((assignment) => assignment.schoolClass.isActive)
    .sort(byText((assignment) => `${assignment.schoolClass.name}${assignment.disciplineName}`));
