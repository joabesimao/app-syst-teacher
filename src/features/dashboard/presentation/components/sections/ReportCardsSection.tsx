import { memo } from "react";
import { Section } from "@/shared/ui";
import type { ReportCard, ReportCardStudent } from "../../../domain/models";
import { openStudent } from "../../navigation";
import { ReportCardView } from "../ReportCardView";
import type { SectionProps } from "./types";

const handleSelect = (card: ReportCard, student: ReportCardStudent) =>
  openStudent({ classId: card.classId, studentId: student.studentId });

export const ReportCardsSection = memo(function ReportCardsSection({ data, filters }: SectionProps) {
  return (
    <Section
      title="Médias da turma e de cada aluno"
      subtitle="Por bimestre e anual (média simples dos bimestres)"
      empty={!data.reportCards.length}
    >
      <ReportCardView
        reportCards={data.reportCards}
        disciplineName={filters.disciplineName}
        onSelectStudent={handleSelect}
      />
    </Section>
  );
});
