import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { formatDate, formatNumber, termLabel } from "@/shared/format";
import { Card, Chip, commonStyles } from "@/shared/ui";
import type { Assessment } from "../../../domain/models";
import { ASSESSMENT_KIND_LABELS } from "../../labels";
import { AssessmentStatusChip } from "../AssessmentStatusChip";
import { styles } from "./styles";

interface AssessmentCardProps {
  assessment: Assessment;
  onPress: (assessment: Assessment) => void;
}

export const AssessmentCard = memo(function AssessmentCard({ assessment, onPress }: AssessmentCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(assessment)}
      style={({ pressed }) => pressed && commonStyles.pressed}
    >
      <Card>
        <View style={commonStyles.spaceBetween}>
          <Text style={[commonStyles.sectionTitle, styles.title]}>{assessment.title}</Text>
          <AssessmentStatusChip status={assessment.status} />
        </View>
        {assessment.kind === "RECOVERY" ? (
          <View style={commonStyles.row}>
            <Chip label={ASSESSMENT_KIND_LABELS.RECOVERY.label} tone="warning" />
          </View>
        ) : null}
        <Text style={commonStyles.muted}>
          {termLabel(assessment.academicTerm)} · Entrega {formatDate(assessment.dueDate)} · Nota máx.{" "}
          {formatNumber(assessment.maxScore)} · Peso {formatNumber(assessment.weight)}
        </Text>
      </Card>
    </Pressable>
  );
});
