import { useQueryClient } from "@tanstack/react-query";
import type { Assessment, AssessmentHeader } from "../../domain/models";
import { isAssessmentStatus } from "../../domain/rules";
import { assessmentKeys } from "../queryKeys";

interface RouteFallback {
  title?: string;
  maxScore?: string;
  status?: string;
}

export function useAssessmentHeader(assessmentId: string | undefined, fallback: RouteFallback): AssessmentHeader | null {
  const queryClient = useQueryClient();
  const cached = queryClient
    .getQueriesData<Assessment[]>({ queryKey: assessmentKeys.lists() })
    .flatMap(([, data]) => data ?? [])
    .find((assessment) => assessment.id === assessmentId);

  if (cached) return { title: cached.title, maxScore: cached.maxScore, status: cached.status };

  const maxScore = Number(fallback.maxScore);
  if (!fallback.title || !Number.isFinite(maxScore) || maxScore <= 0) return null;
  if (!fallback.status || !isAssessmentStatus(fallback.status)) return null;
  return { title: fallback.title, maxScore, status: fallback.status };
}
