import { memo } from "react";
import { Section } from "@/shared/ui";
import { MIN_ATTENDANCE_PERCENT } from "../../../domain/constants";
import { openStudent } from "../../navigation";
import { AbsenceList } from "../lists";
import type { SectionProps } from "./types";

export const StudentAttendanceSection = memo(function StudentAttendanceSection({ data }: SectionProps) {
  return (
    <Section
      title="Alunos com mais faltas"
      subtitle={`Em vermelho: abaixo de ${MIN_ATTENDANCE_PERCENT}%`}
      empty={!data.attendance.students.length}
      emptyMessage="Nenhuma chamada registrada no bimestre."
    >
      <AbsenceList students={data.attendance.students} onPress={openStudent} />
    </Section>
  );
});
