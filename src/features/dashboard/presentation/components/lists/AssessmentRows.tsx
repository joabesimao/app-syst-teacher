import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { AssessmentStatusChip } from "@/features/assessments";
import { formatDate, formatNumber } from "@/shared/format";
import type { AssessmentSummary } from "../../../domain/models";
import { scoreColor } from "../../colors";
import { listStyles } from "./listStyles";

interface AssessmentRowsProps {
  assessments: AssessmentSummary[];
  onPress: (assessment: AssessmentSummary) => void;
}

export const AssessmentRows = memo(function AssessmentRows({ assessments, onPress }: AssessmentRowsProps) {
  return (
    <View>
      {assessments.map((assessment) => (
        <Pressable
          key={assessment.id}
          accessibilityRole="button"
          onPress={() => onPress(assessment)}
          style={({ pressed }) => [listStyles.row, pressed && listStyles.pressed]}
        >
          <View style={listStyles.grow}>
            <Text style={listStyles.primary} numberOfLines={1}>
              {assessment.title}
            </Text>
            <Text style={listStyles.secondary}>
              {assessment.className} · {assessment.disciplineName} · {formatDate(assessment.dueDate)}
            </Text>
            <AssessmentStatusChip status={assessment.status} />
          </View>
          <View style={listStyles.right}>
            <Text style={[listStyles.value, { color: scoreColor(assessment.average) }]}>
              {formatNumber(assessment.average)}
            </Text>
            <Text style={listStyles.secondary}>
              {formatNumber(assessment.lowest?.normalizedScore)}–{formatNumber(assessment.highest?.normalizedScore)}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
});
