import type { Assessment, AssessmentGrades, GradeInput, NewAssessment } from "./models";

export interface ListAssessmentsParams {
  classId: string;
  teacherId?: string;
  signal?: AbortSignal;
}

export interface AssessmentRepository {
  list(params: ListAssessmentsParams): Promise<Assessment[]>;
  create(assessment: NewAssessment): Promise<Assessment>;
  loadGrades(assessmentId: string, classId: string, signal?: AbortSignal): Promise<AssessmentGrades>;
  saveGrades(assessmentId: string, grades: GradeInput[]): Promise<void>;
}
