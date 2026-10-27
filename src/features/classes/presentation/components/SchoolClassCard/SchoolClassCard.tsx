import { memo } from "react";
import { Pressable, Text } from "react-native";
import { Card, commonStyles } from "@/shared/ui";
import type { SchoolClass } from "../../../domain/models";
import { SHIFT_LABELS } from "../../labels";

interface SchoolClassCardProps {
  schoolClass: SchoolClass;
  onPress: (schoolClass: SchoolClass) => void;
}

export const SchoolClassCard = memo(function SchoolClassCard({ schoolClass, onPress }: SchoolClassCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(schoolClass)}
      style={({ pressed }) => pressed && commonStyles.pressed}
    >
      <Card>
        <Text style={commonStyles.sectionTitle}>{schoolClass.name}</Text>
        <Text style={commonStyles.muted}>
          {schoolClass.gradeLevel} · {schoolClass.schoolYear}
          {schoolClass.shift ? ` · ${SHIFT_LABELS[schoolClass.shift]}` : ""}
        </Text>
      </Card>
    </Pressable>
  );
});
