import { memo } from "react";
import { Section } from "@/shared/ui";
import { StatusByDisciplineChart } from "../charts";
import type { SectionProps } from "./types";

export const StatusByDisciplineSection = memo(function StatusByDisciplineSection({ data }: SectionProps) {
  return (
    <Section title="Situação por disciplina" empty={!data.statusByDiscipline.length}>
      <StatusByDisciplineChart items={data.statusByDiscipline} />
    </Section>
  );
});
