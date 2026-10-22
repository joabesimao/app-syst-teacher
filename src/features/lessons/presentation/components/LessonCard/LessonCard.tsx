import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { formatDate, plural, termLabel } from "@/shared/format";
import { Card, commonStyles } from "@/shared/ui";
import type { Lesson } from "../../../domain/models";

interface LessonCardProps {
  lesson: Lesson;
  onPress: (lesson: Lesson) => void;
}

export const LessonCard = memo(function LessonCard({ lesson, onPress }: LessonCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(lesson)}
      style={({ pressed }) => pressed && commonStyles.pressed}
    >
      <Card>
        <View style={commonStyles.spaceBetween}>
          <Text style={commonStyles.sectionTitle}>{formatDate(lesson.date)}</Text>
          <Text style={commonStyles.muted}>
            {plural(lesson.lessonCount, "aula", "aulas")} · {termLabel(lesson.academicTerm)}
          </Text>
        </View>
        {lesson.topic ? <Text style={commonStyles.text}>{lesson.topic}</Text> : null}
        {lesson.attendance ? (
          <Text style={commonStyles.muted}>
            {lesson.attendance.present} presentes · {lesson.attendance.absent} faltas · {lesson.attendance.justified}{" "}
            justificadas
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
});
