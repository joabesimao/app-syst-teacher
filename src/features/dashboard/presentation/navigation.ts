import { router } from "expo-router";
import { routes } from "@/shared/navigation";

export const openStudent = (ref: { classId: string; studentId: string }) =>
  router.push(routes.dashboardStudent({ classId: ref.classId, studentId: ref.studentId }));

export const openAssessment = (id: string) => router.push(routes.dashboardAssessment({ id }));
