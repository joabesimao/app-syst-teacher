import type { Student } from "./models";
import { activeStudentsByName } from "./rules";

const student = (fullName: string, isActive = true): Student => ({
  id: fullName,
  fullName,
  registration: `R-${fullName}`,
  classId: "7A",
  isActive,
});

describe("activeStudentsByName", () => {
  it("remove alunos inativos e ordena pelo nome", () => {
    const result = activeStudentsByName([student("Pedro"), student("Ana", false), student("Álvaro"), student("Bruna")]);
    expect(result.map((item) => item.fullName)).toEqual(["Álvaro", "Bruna", "Pedro"]);
  });

  it("não altera a lista original", () => {
    const students = [student("Bruna"), student("Álvaro")];
    activeStudentsByName(students);
    expect(students.map((item) => item.fullName)).toEqual(["Bruna", "Álvaro"]);
  });
});
