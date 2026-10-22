export const formatDate = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
};

export const todayIso = (now = new Date()) =>
  [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((part) => String(part).padStart(2, "0")).join("-");

const DAY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const isValidDay = (value: string) => {
  const match = DAY_PATTERN.exec(value);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};
