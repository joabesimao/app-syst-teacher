import type { Tone } from "@/shared/theme";
import type { AssessmentKind, AssessmentStatus, InitialAssessmentStatus } from "../domain/models";

export const ASSESSMENT_STATUS_LABELS: Record<AssessmentStatus, { label: string; tone: Tone }> = {
  PLANNED: { label: "Planejada", tone: "neutral" },
  IN_PROGRESS: { label: "Em andamento", tone: "info" },
  COMPLETED: { label: "Concluída", tone: "success" },
};

export const ASSESSMENT_KIND_LABELS: Record<AssessmentKind, { label: string; hint: string }> = {
  REGULAR: { label: "Regular", hint: "Entra na média ponderada do bimestre." },
  RECOVERY: {
    label: "Recuperação",
    hint:
      "Só para quem ficou com média do bimestre abaixo de 7; vale a maior nota entre a média e a recuperação. " +
      "Uma por disciplina no bimestre.",
  },
};

export const INITIAL_STATUS_HINTS: Record<InitialAssessmentStatus, string> = {
  IN_PROGRESS: "As notas já podem ser lançadas.",
  PLANNED: "Não aceita notas até ser iniciada pelo sistema web.",
};
