export const colors = {
  primary: "#07A7DF",
  primaryDark: "#0590C0",
  background: "#F5F6F8",
  surface: "#FFFFFF",
  border: "#E4E4E7",
  inputBorder: "#C8CCD7",
  text: "#181C32",
  muted: "#71717A",
  subtle: "#A1A1AA",
  danger: "#D92D20",
  dangerSoft: "#FFECEC",
  success: "#12B76A",
  successSoft: "#E7F8F0",
  warning: "#F79009",
  warningSoft: "#FEF4E6",
  infoSoft: "#E8F7FF",
  overlay: "rgba(24, 28, 50, 0.4)",
  white: "#FFFFFF",
};

export const spacing = (factor: number) => factor * 8;

export const radius = { sm: 8, md: 12, pill: 999 };

export type Tone = "neutral" | "info" | "success" | "warning" | "danger";

export const tones: Record<Tone, { color: string; background: string }> = {
  neutral: { color: colors.muted, background: colors.background },
  info: { color: colors.primaryDark, background: colors.infoSoft },
  success: { color: colors.success, background: colors.successSoft },
  warning: { color: colors.warning, background: colors.warningSoft },
  danger: { color: colors.danger, background: colors.dangerSoft },
};
