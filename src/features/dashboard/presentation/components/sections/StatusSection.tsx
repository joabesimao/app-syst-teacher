import { memo } from "react";
import { Section } from "@/shared/ui";
import { StatusDonut } from "../charts";
import type { SectionProps } from "./types";

export const StatusSection = memo(function StatusSection({ data }: SectionProps) {
  return (
    <Section title="Situação dos alunos" subtitle="Pior situação entre as disciplinas" empty={!data.kpis.students}>
      <StatusDonut summary={data.statusSummary} />
    </Section>
  );
});
