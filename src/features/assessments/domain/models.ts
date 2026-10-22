export type AssessmentStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

export type InitialAssessmentStatus = Extract<AssessmentStatus, "PLANNED" | "IN_PROGRESS">;

export type AssessmentKind = "REGULAR" | "RECOVERY";

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
  kind: AssessmentKind;
}

export interface NewAssessment {
  title: string;
  classId: string;
  teacherId: string;
  disciplineName: string;
  maxScore: number;
  weight: number;
  dueDate: string;
  status: InitialAssessmentStatus;
  kind: AssessmentKind;
}

export interface AssessmentDraft {
  title: string;
  kind: AssessmentKind;
  dueDate: string;
  maxScore: string;
  weight: string;
  status: InitialAssessmentStatus;
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
