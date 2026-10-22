export const queryRoots = {
  classes: "classes",
  students: "students",
  lessons: "lessons",
  assessments: "assessments",
  dashboard: "dashboard",
} as const;

export const staleTimes = {
  short: 30_000,
  medium: 60_000,
  long: 5 * 60_000,
};

export const PAGE_SIZE = 30;
