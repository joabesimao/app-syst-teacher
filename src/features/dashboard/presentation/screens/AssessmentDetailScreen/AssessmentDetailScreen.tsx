import { ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { AssessmentStatusChip } from "@/features/assessments";
import { formatDate, formatNumber } from "@/shared/format";
import { readParam } from "@/shared/navigation";
import { commonStyles, EmptyState, Loading, Section, StatTile } from "@/shared/ui";
import type { AssessmentScoreRef } from "../../../domain/models";
import { HistogramChart } from "../../components/charts";
import { scoreColor } from "../../colors";
import { useTeacherDashboard } from "../../hooks/useTeacherDashboard";
import { styles } from "./styles";

const scoreText = (score: AssessmentScoreRef | null, maxScore: number) =>
  score ? `${formatNumber(score.score)} / ${formatNumber(maxScore)}` : "-";

export function AssessmentDetailScreen() {
  const id = readParam(useLocalSearchParams(), "id");
  const { data, isPending } = useTeacherDashboard();

  if (isPending) return <Loading />;

  const assessment = data?.assessments.find((item) => item.id === id);
  if (!assessment) return <EmptyState message="Avaliação não encontrada nos filtros atuais do painel." />;

  return (
    <ScrollView style={commonStyles.screen} contentContainerStyle={commonStyles.content}>
      <Stack.Screen options={{ title: assessment.title }} />
      <View style={styles.header}>
        <Text style={commonStyles.subtitle}>
          {assessment.className} · {assessment.disciplineName} · {formatDate(assessment.dueDate)}
          {assessment.kind === "RECOVERY" ? " · Recuperação" : ""}
        </Text>
        <AssessmentStatusChip status={assessment.status} />
      </View>

      <View style={styles.tiles}>
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
