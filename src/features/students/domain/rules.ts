import { byText } from "@/shared/format";
import type { Student } from "./models";

export const activeStudentsByName = (students: Student[]) =>
  students.filter((student) => student.isActive).sort(byText((student) => student.fullName));
