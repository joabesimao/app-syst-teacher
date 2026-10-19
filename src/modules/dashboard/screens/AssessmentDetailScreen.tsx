import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Section } from "../../../components/Section";
import { StatTile } from "../../../components/StatTile";
import { AssessmentStatusChip } from "../../../components/StatusChip";
import { EmptyState, Loading, styles } from "../../../components/ui";
import { spacing } from "../../../theme";
import { formatDate, formatNumber } from "../../../utils/labels";
import { HistogramChart } from "../components/charts";
import { scoreColor } from "../selectors";
import { useTeacherDashboard } from "../useDashboard";
import type { AssessmentScoreRef } from "../types";

const scoreText = (score: AssessmentScoreRef | null, maxScore: number) =>
  score ? `${formatNumber(score.score)} / ${formatNumber(maxScore)}` : "-";

export function AssessmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending } = useTeacherDashboard();

  if (isPending) return <Loading />;

  const assessment = data?.assessments.find((item) => item.id === id);
  if (!assessment) {
    return <EmptyState message="Avaliação não encontrada nos filtros atuais do painel." />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: assessment.title }} />
      <View style={detailStyles.header}>
        <Text style={styles.subtitle}>
          {assessment.className} · {assessment.disciplineName} · {formatDate(assessment.dueDate)}
          {assessment.kind === "RECOVERY" ? " · Recuperação" : ""}
        </Text>
        <AssessmentStatusChip status={assessment.status} />
      </View>

      <View style={detailStyles.tiles}>
        <StatTile
          label="Média (0–10)"
          value={formatNumber(assessment.average)}
          hint={`${assessment.gradedCount} nota(s) lançada(s)`}
          color={scoreColor(assessment.average)}
        />
        <StatTile
          label="Melhor nota"
          value={scoreText(assessment.highest, assessment.maxScore)}
          hint={assessment.highest?.fullName}
          color={scoreColor(assessment.highest?.normalizedScore)}
        />
        <StatTile
          label="Pior nota"
          value={scoreText(assessment.lowest, assessment.maxScore)}
          hint={assessment.lowest?.fullName}
          color={scoreColor(assessment.lowest?.normalizedScore)}
        />
      </View>

      <Section
        title="Distribuição das notas"
        subtitle="Quantidade de alunos por faixa (escala 0–10)"
        empty={!assessment.gradedCount}
        emptyMessage="Nenhuma nota lançada ainda."
      >
        <HistogramChart buckets={assessment.histogram} />
      </Section>
    </ScrollView>
  );
}

const detailStyles = StyleSheet.create({
  header: { gap: spacing(1) },
  tiles: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1) },
});
