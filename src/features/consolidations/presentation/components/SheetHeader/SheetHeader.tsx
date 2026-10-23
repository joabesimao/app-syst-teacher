import { Text, View } from "react-native";
import { formatDate, termLabel } from "@/shared/format";
import { colors } from "@/shared/theme";
import { commonStyles, StatTile } from "@/shared/ui";
import type { ConsolidationSheet } from "../../../domain/models";
import { countOf, formatPerformance, summaryLabel } from "../../../domain/rules";
import { ConsolidationStatusChip } from "../ConsolidationStatusChip";
import { styles } from "./styles";

export function SheetHeader({ sheet }: { sheet: ConsolidationSheet }) {
  const { consolidation, template, summary } = sheet;
  return (
    <View style={styles.container}>
      <View style={commonStyles.spaceBetween}>
        <Text style={[commonStyles.sectionTitle, commonStyles.grow]}>{template.name}</Text>
        <ConsolidationStatusChip status={consolidation.status} />
      </View>
      <Text style={commonStyles.muted}>
        {sheet.schoolName} · {sheet.schoolClass.name} ({sheet.schoolClass.gradeLevel}) · {consolidation.disciplineName}
      </Text>
      <Text style={commonStyles.muted}>
        Prof. {sheet.teacherName} · {formatDate(consolidation.date)} · {termLabel(consolidation.academicTerm)}
      </Text>
      <View style={styles.tiles}>
        {template.options.map((option) => (
          <StatTile
            key={option.id}
            label={summaryLabel(option)}
            value={String(countOf(summary.total.counts, option.id))}
            color={option.color}
          />
        ))}
        {summary.scaleKind === "SCORED" ? (
          <StatTile label="Aproveitamento" value={formatPerformance(summary.total.performance)} color={colors.primary} />
        ) : null}
      </View>
      <Text style={commonStyles.muted}>
        {summary.total.answered} de {summary.total.expected} respostas lançadas
      </Text>
    </View>
  );
}
