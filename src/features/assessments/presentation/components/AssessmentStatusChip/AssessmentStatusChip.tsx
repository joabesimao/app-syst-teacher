import { Chip } from "@/shared/ui";
import type { AssessmentStatus } from "../../../domain/models";
import { ASSESSMENT_STATUS_LABELS } from "../../labels";

export function AssessmentStatusChip({ status }: { status: AssessmentStatus }) {
  const { label, tone } = ASSESSMENT_STATUS_LABELS[status];
  return <Chip label={label} tone={tone} />;
}
