export const formatNumber = (value: number | null | undefined, suffix = "") =>
  value === null || value === undefined
    ? "-"
    : `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}${suffix}`;

export const formatSigned = (value: number) => `${value > 0 ? "+" : ""}${formatNumber(value)}`;
