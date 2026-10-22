import { Chip } from "@/shared/ui";
import type { FinalStatus } from "../../../domain/models";
import { FINAL_STATUS_LABELS } from "../../labels";

export function FinalStatusChip({ status }: { status: FinalStatus }) {
  const { label, tone } = FINAL_STATUS_LABELS[status];
  return <Chip label={label} tone={tone} />;
}
