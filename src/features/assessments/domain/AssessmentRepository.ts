import type { Assessment, AssessmentGrades, GradeInput } from "./models";

export interface ListAssessmentsParams {
  classId: string;
  teacherId?: string;
  signal?: AbortSignal;
}

export interface AssessmentRepository {
  list(params: ListAssessmentsParams): Promise<Assessment[]>;
  loadGrades(assessmentId: string, classId: string, signal?: AbortSignal): Promise<AssessmentGrades>;
  saveGrades(assessmentId: string, grades: GradeInput[]): Promise<void>;
}
