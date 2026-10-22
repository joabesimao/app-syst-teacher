export type AssessmentStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

export interface Assessment {
  id: string;
  title: string;
  classId: string;
  discipline: string;
  academicTerm: number;
  maxScore: number;
  weight: number;
  dueDate: string;
  status: AssessmentStatus;
}

export interface StudentGrade {
  studentId: string;
  fullName: string;
  registration: string;
  score: number | null;
}

export interface AssessmentGrades {
  hasGradesLaunched: boolean;
  students: StudentGrade[];
}

export interface GradeInput {
  studentId: string;
  score: number;
}

export interface GradeEntry {
  studentId: string;
  fullName: string;
  score: string;
}

export interface AssessmentHeader {
  title: string;
  maxScore: number;
  status: AssessmentStatus;
}
