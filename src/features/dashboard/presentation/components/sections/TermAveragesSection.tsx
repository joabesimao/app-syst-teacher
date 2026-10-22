import { memo, useMemo } from "react";
import { Section } from "@/shared/ui";
import { OVERALL, PASSING_AVERAGE } from "../../../domain/constants";
import { classYear, hasTermData } from "../../../domain/rules";
import { TermLineChart } from "../charts";
import type { SectionProps } from "./types";

export const TermAveragesSection = memo(function TermAveragesSection({ data, filters }: SectionProps) {
  const discipline = filters.disciplineName ?? OVERALL;
  const series = useMemo(
    () => data.reportCards.map((card) => ({ label: card.className, terms: classYear(card, discipline).terms })),
    [data.reportCards, discipline]
  );
  return (
    <Section
      title="Média da turma por bimestre"
      subtitle={`Média oficial · aprovação em ${PASSING_AVERAGE}`}
      empty={!hasTermData(series)}
    >
      <TermLineChart series={series} />
    </Section>
  );
});
