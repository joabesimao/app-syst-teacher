import type { Tone } from "@/shared/theme";
import type { FinalStatus, StatusSummary } from "../domain/models";

export const FINAL_STATUS_LABELS: Record<FinalStatus, { label: string; tone: Tone }> = {
  APPROVED: { label: "Aprovado", tone: "success" },
  RECOVERY: { label: "Recuperação", tone: "warning" },
  FAILED: { label: "Reprovado", tone: "danger" },
  NO_GRADES: { label: "Sem notas", tone: "neutral" },
};

export const TERM_LABELS = ["1º", "2º", "3º", "4º"];

export const HISTOGRAM_LABELS = ["0–2", "2–4", "4–6", "6–8", "8–10"];

export const STATUS_ITEMS: readonly (readonly [keyof StatusSummary, string])[] = [
  ["approved", "Aprovados"],
  ["recovery", "Recuperação"],
  ["failed", "Reprovados"],
  ["noGrades", "Sem notas"],
];
