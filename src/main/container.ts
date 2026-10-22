import { FetchHttpClient } from "@/core/http/FetchHttpClient";
import { SessionManager } from "@/core/session/SessionManager";
import { sessionStorage } from "@/core/session/storage/secureStore";
import type { SessionStorage } from "@/core/session/types";
import { HttpAssessmentRepository } from "@/features/assessments/data/HttpAssessmentRepository";
import { HttpAuthRepository } from "@/features/auth/data/HttpAuthRepository";
import { HttpClassRepository } from "@/features/classes/data/HttpClassRepository";
import { HttpDashboardRepository } from "@/features/dashboard/data/HttpDashboardRepository";
import { HttpLessonRepository } from "@/features/lessons/data/HttpLessonRepository";
import { HttpStudentRepository } from "@/features/students/data/HttpStudentRepository";
import type { AppDependencies } from "./di/types";
import { env } from "./env";

interface ContainerOptions {
  apiUrl?: string;
  storage?: SessionStorage;
  fetchFn?: typeof fetch;
}

export function createContainer({
  apiUrl = env.apiUrl,
  storage = sessionStorage,
  fetchFn,
}: ContainerOptions = {}): AppDependencies {
  const session = new SessionManager(storage);
  const http = new FetchHttpClient({ baseUrl: apiUrl, session, fetchFn });
  const authRepository = new HttpAuthRepository(http);
  session.setRenewer((refreshToken) => authRepository.renew(refreshToken));

  return {
    session,
    authRepository,
    classRepository: new HttpClassRepository(http),
    studentRepository: new HttpStudentRepository(http),
    lessonRepository: new HttpLessonRepository(http),
    assessmentRepository: new HttpAssessmentRepository(http),
    dashboardRepository: new HttpDashboardRepository(http),
  };
}
