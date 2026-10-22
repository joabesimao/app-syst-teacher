import { memo } from "react";
import { Section } from "@/shared/ui";
import type { AssessmentSummary } from "../../../domain/models";
import { openAssessment } from "../../navigation";
import { AssessmentRows } from "../lists";
import type { SectionProps } from "./types";

const handlePress = (assessment: AssessmentSummary) => openAssessment(assessment.id);

export const AssessmentsSection = memo(function AssessmentsSection({ data }: SectionProps) {
  return (
    <Section
      title="Notas das avaliações"
      subtitle="Média 0–10 · menor–maior nota"
      empty={!data.assessments.length}
      emptyMessage="Nenhuma avaliação no bimestre."
    >
      <AssessmentRows assessments={data.assessments} onPress={handlePress} />
    </Section>
  );
});
