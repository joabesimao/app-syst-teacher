import type { Tone } from "@/shared/theme";
import type { AssessmentStatus } from "../domain/models";

export const ASSESSMENT_STATUS_LABELS: Record<AssessmentStatus, { label: string; tone: Tone }> = {
  PLANNED: { label: "Planejada", tone: "neutral" },
  IN_PROGRESS: { label: "Em andamento", tone: "info" },
  COMPLETED: { label: "Concluída", tone: "success" },
};
