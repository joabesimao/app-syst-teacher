import type { Student } from "../domain/models";
import type { ApiStudent } from "./dto";

export const toStudent = (student: ApiStudent): Student => ({
  id: student.id,
  fullName: student.fullName,
  registration: student.registration,
  classId: student.classId,
  isActive: student.isActive,
});
