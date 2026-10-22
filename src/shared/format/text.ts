const normalize = (value: string) => value.trim().toLowerCase();

export const sameText = (a: string, b: string) => normalize(a) === normalize(b);

export const byText =
  <T>(select: (item: T) => string) =>
  (a: T, b: T) =>
    select(a).localeCompare(select(b), "pt-BR");

export const termLabel = (term: string | number) => `${term}º Bimestre`;

export const plural = (count: number, singular: string, pluralForm: string) =>
  `${count} ${count === 1 ? singular : pluralForm}`;
