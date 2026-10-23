import type { Tone } from "@/shared/theme";
import type { CellDisplay, ConsolidationStatus } from "../domain/models";

export const CONSOLIDATION_STATUS_LABELS: Record<ConsolidationStatus, { label: string; tone: Tone }> = {
  IN_PROGRESS: { label: "Em andamento", tone: "info" },
  COMPLETED: { label: "Concluída", tone: "success" },
};

export const CELL_DISPLAY_SEGMENTS: { key: CellDisplay; label: string }[] = [
  { key: "text", label: "Texto" },
  { key: "icon", label: "Ícones" },
];
