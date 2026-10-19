import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Section } from "../../../components/Section";
import { StatTile } from "../../../components/StatTile";
import { FinalStatusChip } from "../../../components/StatusChip";
import { EmptyState, Loading, styles } from "../../../components/ui";
import { colors, spacing } from "../../../theme";
import { formatNumber } from "../../../utils/labels";
import { TermLineChart } from "../components/charts";
import { classYear, scoreColor, TERM_LABELS } from "../selectors";
import { useTeacherDashboard } from "../useDashboard";
import { MIN_ATTENDANCE_PERCENT, OVERALL } from "../types";

export function StudentDetailScreen() {
  const { classId, studentId } = useLocalSearchParams<{ classId: string; studentId: string }>();
  const { data, isPending } = useTeacherDashboard();

  if (isPending) return <Loading />;

  const card = data?.reportCards.find((item) => item.classId === classId);
  const student = card?.students.find((item) => item.studentId === studentId);
  if (!card || !student) {
    return <EmptyState message="Aluno não encontrado nos filtros atuais do painel." />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: student.fullName }} />
      <View style={detailStyles.header}>
        <Text style={styles.subtitle}>
          {card.className} · Matrícula {student.registration}
          {student.transferred ? " · transferido" : ""}
        </Text>
        <FinalStatusChip status={student.status} />
      </View>

      <View style={detailStyles.tiles}>
        <StatTile
          label="Média anual geral"
          value={formatNumber(student.overall.annual)}
          color={scoreColor(student.overall.annual)}
        />
        <StatTile
          label="Média anual da turma"
          value={formatNumber(card.classAverage.overall.annual)}
          color={scoreColor(card.classAverage.overall.annual)}
        />
      </View>

      <Section title="Desempenho comparado à turma" subtitle="Média geral por bimestre">
        <TermLineChart
          series={[
            { label: "Aluno", terms: student.overall.terms, color: colors.primary },
            { label: "Turma", terms: classYear(card, OVERALL).terms, color: colors.muted },
          ]}
        />
      </Section>

      <Section title="Médias por disciplina">
        <View style={detailStyles.row}>
          <Text style={[detailStyles.name, detailStyles.head]}>Disciplina</Text>
          {TERM_LABELS.map((label) => (
            <Text key={label} style={[detailStyles.cell, detailStyles.head]}>
              {label}
            </Text>
          ))}
          <Text style={[detailStyles.cell, detailStyles.annual, detailStyles.head]}>Anual</Text>
        </View>
        {student.disciplines.map((discipline) => (
          <View key={discipline.disciplineName} style={detailStyles.row}>
            <Text style={detailStyles.name} numberOfLines={1}>
              {discipline.disciplineName}
            </Text>
            {discipline.terms.map((value, index) => (
              <Text key={index} style={[detailStyles.cell, { color: scoreColor(value) }]}>
                {formatNumber(value)}
              </Text>
            ))}
            <Text style={[detailStyles.cell, detailStyles.annual, { color: scoreColor(discipline.annual) }]}>
              {formatNumber(discipline.annual)}
            </Text>
          </View>
        ))}
        <View style={detailStyles.row}>
          <Text style={detailStyles.name}>Frequência</Text>
          {student.attendance.map((value, index) => (
            <Text
              key={index}
              style={[
                detailStyles.cell,
                value !== null && value < MIN_ATTENDANCE_PERCENT && { color: colors.danger },
              ]}
            >
              {value === null ? "-" : `${Math.round(value)}%`}
            </Text>
          ))}
          <Text style={[detailStyles.cell, detailStyles.annual]} />
        </View>
      </Section>
    </ScrollView>
  );
}

const detailStyles = StyleSheet.create({
  header: { gap: spacing(1) },
  tiles: { flexDirection: "row", gap: spacing(1) },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing(0.75),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  head: { fontSize: 11, fontWeight: "700", color: colors.muted },
  name: { flex: 1, fontSize: 14, color: colors.text },
  cell: { width: 38, textAlign: "right", fontSize: 13, color: colors.text },
  annual: { width: 44, fontWeight: "700" },
});
