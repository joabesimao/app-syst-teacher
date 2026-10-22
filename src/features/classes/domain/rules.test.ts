import type { SchoolClass, TeacherAssignment } from "./models";
import { activeAssignments, assignmentKey } from "./rules";

const schoolClass = (name: string, isActive = true): SchoolClass => ({
  id: name,
  name,
  gradeLevel: "7o Ano",
  schoolYear: 2026,
  shift: null,
  isActive,
});

const assignment = (className: string, disciplineName: string, isActive = true): TeacherAssignment => ({
  classId: className,
  disciplineName,
  schoolClass: schoolClass(className, isActive),
});

describe("activeAssignments", () => {
  it("remove turmas inativas e ordena por turma e disciplina", () => {
    const result = activeAssignments([
      assignment("8B", "Matemática"),
      assignment("7A", "Português"),
      assignment("6C", "Ciências", false),
      assignment("7A", "Matemática"),
    ]);
    expect(result.map(assignmentKey)).toEqual(["7A:Matemática", "7A:Português", "8B:Matemática"]);
  });
});
