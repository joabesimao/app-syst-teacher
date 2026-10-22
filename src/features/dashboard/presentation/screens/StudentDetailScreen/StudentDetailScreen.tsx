import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { formatNumber } from "@/shared/format";
import { readParam } from "@/shared/navigation";
import { colors } from "@/shared/theme";
import { commonStyles, EmptyState, Loading, Section, StatTile } from "@/shared/ui";
import { OVERALL } from "../../../domain/constants";
import { classYear } from "../../../domain/rules";
import { TermLineChart } from "../../components/charts";
import { DisciplineAveragesTable } from "../../components/DisciplineAveragesTable";
import { FinalStatusChip } from "../../components/FinalStatusChip";
import { scoreColor } from "../../colors";
import { useTeacherDashboard } from "../../hooks/useTeacherDashboard";
import { styles } from "./styles";

export function StudentDetailScreen() {
  const params = useLocalSearchParams();
  const classId = readParam(params, "classId");
  const studentId = readParam(params, "studentId");
  const { data, isPending } = useTeacherDashboard();

  const card = data?.reportCards.find((item) => item.classId === classId);
  const student = card?.students.find((item) => item.studentId === studentId);

  const series = useMemo(
    () =>
      card && student
        ? [
            { label: "Aluno", terms: student.overall.terms, color: colors.primary },
            { label: "Turma", terms: classYear(card, OVERALL).terms, color: colors.muted },
          ]
        : [],
    [card, student]
  );

  if (isPending) return <Loading />;
  if (!card || !student) return <EmptyState message="Aluno não encontrado nos filtros atuais do painel." />;

  return (
    <ScrollView style={commonStyles.screen} contentContainerStyle={commonStyles.content}>
      <Stack.Screen options={{ title: student.fullName }} />
      <View style={styles.header}>
        <Text style={commonStyles.subtitle}>
          {card.className} · Matrícula {student.registration}
          {student.transferred ? " · transferido" : ""}
        </Text>
        <FinalStatusChip status={student.status} />
      </View>

      <View style={styles.tiles}>
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
        <TermLineChart series={series} />
      </Section>

      <Section title="Médias por disciplina">
        <DisciplineAveragesTable student={student} />
      </Section>
    </ScrollView>
  );
}
