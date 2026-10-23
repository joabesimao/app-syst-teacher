import type { SessionManager } from "@/core/session/SessionManager";
import type { AssessmentRepository } from "@/features/assessments/domain/AssessmentRepository";
import type { AuthRepository } from "@/features/auth/domain/AuthRepository";
import type { ClassRepository } from "@/features/classes/domain/ClassRepository";
import type { ConsolidationRepository } from "@/features/consolidations/domain/ConsolidationRepository";
import type { DashboardRepository } from "@/features/dashboard/domain/DashboardRepository";
import type { LessonRepository } from "@/features/lessons/domain/LessonRepository";
import type { StudentRepository } from "@/features/students/domain/StudentRepository";

export interface AppDependencies {
  session: SessionManager;
  authRepository: AuthRepository;
  classRepository: ClassRepository;
  studentRepository: StudentRepository;
  lessonRepository: LessonRepository;
  assessmentRepository: AssessmentRepository;
  consolidationRepository: ConsolidationRepository;
  dashboardRepository: DashboardRepository;
}
