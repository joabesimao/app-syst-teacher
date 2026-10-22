import { memo } from "react";
import { Pressable, Text } from "react-native";
import { Card, commonStyles } from "@/shared/ui";
import type { TeacherAssignment } from "../../../domain/models";
import { SHIFT_LABELS } from "../../labels";

interface AssignmentCardProps {
  assignment: TeacherAssignment;
  onPress: (assignment: TeacherAssignment) => void;
}

export const AssignmentCard = memo(function AssignmentCard({ assignment, onPress }: AssignmentCardProps) {
  const { schoolClass, disciplineName } = assignment;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(assignment)}
      style={({ pressed }) => pressed && commonStyles.pressed}
    >
      <Card>
        <Text style={commonStyles.sectionTitle}>
          {schoolClass.name} · {disciplineName}
        </Text>
        <Text style={commonStyles.muted}>
          {schoolClass.gradeLevel} · {schoolClass.schoolYear}
          {schoolClass.shift ? ` · ${SHIFT_LABELS[schoolClass.shift]}` : ""}
        </Text>
      </Card>
    </Pressable>
  );
});
