export type ClassRouteParams = {
  classId: string;
  discipline: string;
  className: string;
};

export type AttendanceRouteParams = ClassRouteParams & {
  lessonId?: string;
};

export type GradesRouteParams = {
  assessmentId: string;
  classId: string;
  title: string;
  maxScore: string;
  status: string;
};

export const routes = {
  classDetail: (params: ClassRouteParams) => ({ pathname: "/turma", params }) as const,
  attendance: ({ lessonId, ...params }: AttendanceRouteParams) =>
    ({ pathname: "/chamada", params: lessonId ? { ...params, lessonId } : params }) as const,
  grades: (params: GradesRouteParams) => ({ pathname: "/notas", params }) as const,
  newAssessment: (params: ClassRouteParams) => ({ pathname: "/nova-avaliacao", params }) as const,
  dashboardStudent: (params: { classId: string; studentId: string }) => ({ pathname: "/aluno", params }) as const,
  dashboardAssessment: (params: { id: string }) => ({ pathname: "/avaliacao", params }) as const,
  consolidation: (params: { consolidationId: string }) => ({ pathname: "/consolidacao", params }) as const,
  newConsolidation: (params: ClassRouteParams) => ({ pathname: "/nova-consolidacao", params }) as const,
  launchConsolidation: (params: { consolidationId: string; studentId: string }) =>
    ({ pathname: "/lancar-consolidacao", params }) as const,
  newConsolidationTemplate: () => ({ pathname: "/novo-modelo" }) as const,
};
