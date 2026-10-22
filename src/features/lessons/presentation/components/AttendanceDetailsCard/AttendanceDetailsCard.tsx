import { memo } from "react";
import { Card, Field, Stepper } from "@/shared/ui";
import { LESSON_COUNT_LIMITS } from "../../../domain/rules";
import { styles } from "./styles";

interface AttendanceDetailsCardProps {
  date: string;
  lessonCount: number;
  topic: string;
  onChangeDate: (value: string) => void;
  onChangeLessonCount: (value: number) => void;
  onChangeTopic: (value: string) => void;
}

export const AttendanceDetailsCard = memo(function AttendanceDetailsCard({
  date,
  lessonCount,
  topic,
  onChangeDate,
  onChangeLessonCount,
  onChangeTopic,
}: AttendanceDetailsCardProps) {
  return (
    <Card style={styles.card}>
      <Field
        label="Data (AAAA-MM-DD)"
        value={date}
        onChangeText={onChangeDate}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />
      <Stepper
        label="Quantidade de aulas"
        value={lessonCount}
        min={LESSON_COUNT_LIMITS.min}
        max={LESSON_COUNT_LIMITS.max}
        onChange={onChangeLessonCount}
      />
      <Field label="Conteúdo da aula (opcional)" value={topic} onChangeText={onChangeTopic} />
    </Card>
  );
});
