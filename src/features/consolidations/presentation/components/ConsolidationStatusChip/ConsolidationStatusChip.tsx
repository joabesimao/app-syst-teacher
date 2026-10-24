import { Chip } from "@/shared/ui";
import type { ConsolidationStatus } from "../../../domain/models";
import { CONSOLIDATION_STATUS_LABELS } from "../../labels";

export function ConsolidationStatusChip({ status }: { status: ConsolidationStatus }) {
  const { label, tone } = CONSOLIDATION_STATUS_LABELS[status];
  return <Chip label={label} tone={tone} />;
}
