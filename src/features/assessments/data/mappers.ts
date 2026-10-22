import type { Assessment, AssessmentGrades } from "../domain/models";
import type { ApiAssessment, ApiAssessmentGrades } from "./dto";

export const toAssessment = (assessment: ApiAssessment): Assessment => ({
  id: assessment.id,
  title: assessment.title,
  classId: assessment.classId,
  discipline: assessment.disciplineName,
  academicTerm: assessment.academicTerm,
  maxScore: assessment.maxScore,
  weight: assessment.weight,
  dueDate: assessment.dueDate.slice(0, 10),
  status: assessment.status,
  kind: assessment.kind ?? "REGULAR",
});

export const toAssessmentGrades = (response: ApiAssessmentGrades): AssessmentGrades => ({
  hasGradesLaunched: response.gradingInfo.hasGradesLaunched,
  students: response.data.map((item) => ({
    studentId: item.studentId,
    fullName: item.fullName,
    registration: item.registration,
    score: item.evaluationNote,
  })),
});
