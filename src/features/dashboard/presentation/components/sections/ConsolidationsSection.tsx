import { memo, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { countOf, formatPerformance, LOW_PERFORMANCE, OptionTag } from "@/features/consolidations";
import { formatDate } from "@/shared/format";
import { routes } from "@/shared/navigation";
import { colors } from "@/shared/theme";
import { commonStyles, Section } from "@/shared/ui";
import type { ConsolidationOverview } from "../../../domain/models";
import { openStudent } from "../../navigation";
import { PercentBars } from "../charts";
import { listStyles } from "../lists/listStyles";
import { styles } from "./styles";
import type { SectionProps } from "./types";

const performanceColor = (value: number | null) =>
  value === null ? colors.muted : value < LOW_PERFORMANCE ? colors.danger : colors.success;

const totals = (consolidation: ConsolidationOverview) =>
  consolidation.options.map((option) => ({
    option,
    count: consolidation.items.reduce((sum, item) => sum + countOf(item.counts, option.id), 0),
  }));

const ConsolidationBlock = memo(function ConsolidationBlock({ consolidation }: { consolidation: ConsolidationOverview }) {
  const scored = consolidation.scaleKind === "SCORED";
  const bars = useMemo(
    () => consolidation.items.map((item) => ({ label: item.label, value: item.performance })),
    [consolidation.items]
  );

  return (
    <View style={styles.consolidation}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(routes.consolidation({ consolidationId: consolidation.id }))}
        style={({ pressed }) => [commonStyles.spaceBetween, pressed && listStyles.pressed]}
      >
        <View style={listStyles.grow}>
          <Text style={listStyles.primary}>{consolidation.title ?? consolidation.templateName}</Text>
          <Text style={listStyles.secondary}>
            {consolidation.className} · {consolidation.disciplineName} · {formatDate(consolidation.date)} ·{" "}
            {consolidation.students} alunos
          </Text>
        </View>
        {scored ? (
          <Text style={[listStyles.value, { color: performanceColor(consolidation.performance) }]}>
            {formatPerformance(consolidation.performance)}
          </Text>
        ) : null}
      </Pressable>
      {scored ? (
        <PercentBars items={bars} colorFor={performanceColor} />
      ) : (
        <View style={styles.distribution}>
          {totals(consolidation).map(({ option, count }) => (
            <View key={option.id} style={commonStyles.row}>
              <OptionTag option={option} display="text" />
              <Text style={commonStyles.muted}>{count}</Text>
            </View>
          ))}
        </View>
      )}
      {consolidation.lowPerformers.length ? (
        <View>
          <Text style={listStyles.secondary}>Abaixo de {LOW_PERFORMANCE}% de aproveitamento</Text>
          {consolidation.lowPerformers.map((student) => (
            <Pressable
              key={student.studentId}
              accessibilityRole="button"
              onPress={() => openStudent(student)}
              style={({ pressed }) => [listStyles.row, pressed && listStyles.pressed]}
            >
              <Text style={[listStyles.primary, listStyles.grow]} numberOfLines={1}>
                {student.fullName}
              </Text>
              <Text style={[listStyles.value, { color: colors.danger }]}>{formatPerformance(student.performance)}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
});

export const ConsolidationsSection = memo(function ConsolidationsSection({ data }: SectionProps) {
  const consolidations = data.consolidations ?? [];
  return (
    <Section
      title="Consolidações"
      subtitle="Concluídas no bimestre · aproveitamento por item"
      empty={!consolidations.length}
      emptyMessage="Nenhuma consolidação concluída no bimestre."
    >
      {consolidations.map((consolidation) => (
        <ConsolidationBlock key={consolidation.id} consolidation={consolidation} />
      ))}
    </Section>
  );
});
