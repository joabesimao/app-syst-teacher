import type { ApiPage } from "@/core/http/ApiPage";
import type { HttpClient } from "@/core/http/HttpClient";
import type { AssessmentRepository, ListAssessmentsParams } from "../domain/AssessmentRepository";
import type { Assessment, AssessmentGrades, GradeInput, NewAssessment } from "../domain/models";
import type { ApiAssessment, ApiAssessmentGrades } from "./dto";
import { toAssessment, toAssessmentGrades } from "./mappers";

const MAX_PAGE_SIZE = 100;

export class HttpAssessmentRepository implements AssessmentRepository {
  constructor(private readonly http: HttpClient) {}

  async list({ classId, teacherId, signal }: ListAssessmentsParams): Promise<Assessment[]> {
    const response = await this.http.get<ApiPage<ApiAssessment>>("/assessments", {
      query: { classId, teacherId, limit: MAX_PAGE_SIZE },
      signal,
    });
    return response.data.map(toAssessment);
  }

  async create(assessment: NewAssessment): Promise<Assessment> {
    return toAssessment(await this.http.post<ApiAssessment>("/assessments", assessment));
  }

  async loadGrades(assessmentId: string, classId: string, signal?: AbortSignal): Promise<AssessmentGrades> {
    return toAssessmentGrades(
      await this.http.get<ApiAssessmentGrades>(`/assessments/${assessmentId}/class/${classId}/students-grades`, {
        signal,
      })
    );
  }

  async saveGrades(assessmentId: string, grades: GradeInput[]): Promise<void> {
    await this.http.post(`/assessments/${assessmentId}/grades`, { grades });
  }
}
