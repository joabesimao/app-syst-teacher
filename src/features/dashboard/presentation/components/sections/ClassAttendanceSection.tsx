import { memo, useMemo } from "react";
import { Section } from "@/shared/ui";
import { PercentBars } from "../charts";
import type { SectionProps } from "./types";

export const ClassAttendanceSection = memo(function ClassAttendanceSection({ data }: SectionProps) {
  const items = useMemo(
    () => data.attendance.classes.map((item) => ({ label: item.className, value: item.attendancePercent })),
    [data.attendance.classes]
  );
  return (
    <Section
      title="Turmas com mais faltas"
      subtitle="Frequência no bimestre (justificadas não contam)"
      empty={!items.length}
      emptyMessage="Nenhuma chamada registrada no bimestre."
    >
      <PercentBars items={items} />
    </Section>
  );
});
