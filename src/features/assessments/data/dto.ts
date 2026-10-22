import type { AssessmentStatus } from "../domain/models";

export interface ApiAssessment {
  id: string;
  classId: string;
  title: string;
  disciplineName: string;
  academicTerm: number;
  maxScore: number;
  weight: number;
  dueDate: string;
  status: AssessmentStatus;
}

export interface ApiGradeItem {
  studentId: string;
  fullName: string;
  registration: string;
  evaluationNote: number | null;
}

export interface ApiAssessmentGrades {
  gradingInfo: { hasGradesLaunched: boolean };
  data: ApiGradeItem[];
}
