import { ValidationError } from "@/core/domain/errors";
import { isValidDay } from "@/shared/format";
import type { NewStudent, Student, StudentDraft } from "./models";
import type { StudentRepository } from "./StudentRepository";

export interface CreateStudentInput {
  classId: string;
  draft: StudentDraft;
}

const MIN_TEXT_LENGTH = 3;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createStudent(
  { studentRepository }: { studentRepository: StudentRepository },
  { classId, draft }: CreateStudentInput
): Promise<Student> {
  const fullName = draft.fullName.trim();
  const registration = draft.registration.trim();
  const birthDate = draft.birthDate.trim();
  const email = draft.email.trim();
  const phone = draft.phone.trim();
  if (fullName.length < MIN_TEXT_LENGTH) {
    throw new ValidationError(`Informe o nome completo com ao menos ${MIN_TEXT_LENGTH} letras`);
  }
  if (registration.length < MIN_TEXT_LENGTH) {
    throw new ValidationError(`A matrícula deve ter ao menos ${MIN_TEXT_LENGTH} caracteres`);
  }
  if (birthDate && !isValidDay(birthDate)) {
    throw new ValidationError("Data de nascimento inválida. Use o formato AAAA-MM-DD");
  }
  if (email && !EMAIL_PATTERN.test(email)) {
    throw new ValidationError("E-mail inválido");
  }

  const student: NewStudent = { classId, fullName, registration };
  if (birthDate) student.birthDate = birthDate;
  if (email) student.email = email;
  if (phone) student.phone = phone;
  return studentRepository.create(student);
}
