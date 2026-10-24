import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { formatDate, plural, termLabel } from "@/shared/format";
import { Card, commonStyles } from "@/shared/ui";
import type { Consolidation } from "../../../domain/models";
import { consolidationLabel } from "../../../domain/rules";
import { ConsolidationStatusChip } from "../ConsolidationStatusChip";
import { styles } from "./styles";

interface ConsolidationCardProps {
  consolidation: Consolidation;
  showClass?: boolean;
  onPress: (consolidation: Consolidation) => void;
}

export const ConsolidationCard = memo(function ConsolidationCard({
  consolidation,
  showClass,
  onPress,
}: ConsolidationCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(consolidation)}
      style={({ pressed }) => pressed && commonStyles.pressed}
    >
      <Card>
        <View style={commonStyles.spaceBetween}>
          <Text style={[commonStyles.sectionTitle, styles.title]}>{consolidationLabel(consolidation)}</Text>
          <ConsolidationStatusChip status={consolidation.status} />
        </View>
        {consolidation.title ? <Text style={commonStyles.muted}>{consolidation.templateName}</Text> : null}
        <Text style={commonStyles.muted}>
          {showClass ? `${consolidation.className} · ${consolidation.disciplineName} · ` : ""}
          {termLabel(consolidation.academicTerm)} · {formatDate(consolidation.date)} ·{" "}
          {plural(consolidation.responsesCount, "resposta", "respostas")}
        </Text>
      </Card>
    </Pressable>
  );
});
