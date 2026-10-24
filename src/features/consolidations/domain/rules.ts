import { formatNumber, sameText } from "@/shared/format";
import type {
  CellDisplay,
  ConsolidationCells,
  ConsolidationScaleOption,
  ConsolidationTemplate,
  OptionCounts,
  ResponseInput,
  SheetStudent,
} from "./models";

export const LOW_PERFORMANCE = 50;

export const optionTag = (option: ConsolidationScaleOption, display: CellDisplay) =>
  display === "icon" && option.icon ? option.icon : option.label;

export const summaryLabel = (option: ConsolidationScaleOption) => option.summaryLabel ?? option.label;

export const formatPerformance = (performance: number | null) => formatNumber(performance, "%");

export const consolidationLabel = (consolidation: { title: string | null; templateName: string }) =>
  consolidation.title ?? consolidation.templateName;

export const templatesForDiscipline = (templates: ConsolidationTemplate[], discipline: string) =>
  templates.filter(
    (template) => template.isActive && (!template.disciplineName || sameText(template.disciplineName, discipline))
  );

export const countOf = (counts: OptionCounts, optionId: string) => counts[optionId] ?? 0;

export const answeredItems = (cells: ConsolidationCells) => Object.values(cells).filter(Boolean).length;

export const changedResponses = (
  students: SheetStudent[],
  draft: Record<string, ConsolidationCells>
): ResponseInput[] =>
  students.flatMap((student) =>
    Object.entries(draft[student.studentId] ?? {}).flatMap(([itemId, optionId]) =>
      (student.responses[itemId] ?? null) === optionId ? [] : [{ studentId: student.studentId, itemId, optionId }]
    )
  );
