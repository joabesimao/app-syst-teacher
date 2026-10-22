import type { Tone } from "@/shared/theme";
import type { AttendanceStatus } from "../domain/models";

export const ATTENDANCE_LABELS: Record<AttendanceStatus, { label: string; short: string; tone: Tone }> = {
  PRESENT: { label: "Presente", short: "P", tone: "success" },
  ABSENT: { label: "Falta", short: "F", tone: "danger" },
  JUSTIFIED: { label: "Justificada", short: "J", tone: "warning" },
};
