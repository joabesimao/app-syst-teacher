import { colors } from "../theme";
import type { AssessmentStatus, FinalStatus } from "../types/domain";
import { ASSESSMENT_STATUS, FINAL_STATUS } from "../utils/labels";
import { Chip } from "./ui";

type Tone = (typeof FINAL_STATUS)[FinalStatus]["color"];

const TONES: Record<Tone, { color: string; background: string }> = {
  default: { color: colors.muted, background: colors.background },
  primary: { color: colors.primaryDark, background: colors.infoSoft },
  secondary: { color: colors.text, background: colors.background },
  info: { color: colors.primaryDark, background: colors.infoSoft },
  success: { color: colors.success, background: colors.successSoft },
  warning: { color: colors.warning, background: colors.warningSoft },
  error: { color: colors.danger, background: colors.dangerSoft },
};

export function FinalStatusChip({ status }: { status: FinalStatus }) {
  const { label, color } = FINAL_STATUS[status];
  return <Chip label={label} {...TONES[color]} />;
}

export function AssessmentStatusChip({ status }: { status: AssessmentStatus }) {
  const { label, color } = ASSESSMENT_STATUS[status];
  return <Chip label={label} {...TONES[color]} />;
}
