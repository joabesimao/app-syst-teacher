import { useState } from "react";
import type { ReactElement } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ChipGroup } from "../../../components/ChipGroup";
import { Section } from "../../../components/Section";
import { StatTile } from "../../../components/StatTile";
import { Banner, Button, Loading, styles } from "../../../components/ui";
import { useAuthStore } from "../../../store/useAuthStore";
import { colors, spacing } from "../../../theme";
import { formatNumber, termLabel } from "../../../utils/labels";
import { PercentBars, StatusByDisciplineChart, StatusDonut, TermLineChart } from "../components/charts";
import { FiltersModal } from "../components/FiltersModal";
import type { RankingRow } from "../components/lists";
import { AbsenceList, AssessmentRows, RankingList } from "../components/lists";
import { ReportCardView } from "../components/ReportCardView";
import { classYear, scoreColor } from "../selectors";
import { useDashboardFilters, useTeacherDashboard } from "../useDashboard";
import type { DashboardStudentRef } from "../types";
import { MIN_ATTENDANCE_PERCENT, OVERALL, PASSING_AVERAGE } from "../types";

type RankingMode = "best" | "worst" | "risers" | "fallers";

const openStudent = (ref: Pick<DashboardStudentRef, "classId" | "studentId">) =>
  router.push({ pathname: "/aluno", params: { classId: ref.classId, studentId: ref.studentId } });

const signed = (value: number) => `${value > 0 ? "+" : ""}${formatNumber(value)}`;

export function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const filters = useDashboardFilters((state) => state.filters);
  const setFilters = useDashboardFilters((state) => state.setFilters);
  const { data, error, isPending, isFetching, refetch } = useTeacherDashboard();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [rankingMode, setRankingMode] = useState<RankingMode>("best");

  if (isPending) return <Loading />;

  const kpis = data?.kpis;
  const reportCards = data?.reportCards ?? [];

  const rankingRows = (): RankingRow[] => {
    if (!data) return [];
    if (rankingMode === "best" || rankingMode === "worst") {
      return data.ranking[rankingMode].map((item) => ({
        key: `${item.classId}:${item.studentId}`,
        primary: item.fullName,
        secondary: item.className,
        value: formatNumber(item.average),
        color: scoreColor(item.average),
        onPress: () => openStudent(item),
      }));
    }
    return data.evolution[rankingMode].map((item) => ({
      key: `${item.classId}:${item.studentId}`,
      primary: item.fullName,
      secondary: `${item.className} · ${formatNumber(item.previous)} → ${formatNumber(item.current)}`,
      value: signed(item.delta),
      color: item.delta > 0 ? colors.success : colors.danger,
      onPress: () => openStudent(item),
    }));
  };

  const sections: { key: string; render: () => ReactElement }[] = data
    ? [
        {
          key: "kpis",
          render: () => (
            <View style={screenStyles.tiles}>
              <StatTile label="Alunos" value={String(kpis?.students ?? 0)} />
              <StatTile
                label="Média oficial"
                value={formatNumber(kpis?.officialAverage)}
                hint={`Parcial: ${formatNumber(kpis?.partialAverage)}`}
                color={scoreColor(kpis?.officialAverage)}
              />
              <StatTile
                label="Frequência"
                value={formatNumber(kpis?.attendancePercent, "%")}
                hint={`${kpis?.belowMinimumAttendance ?? 0} abaixo de ${MIN_ATTENDANCE_PERCENT}%`}
                color={
                  kpis?.attendancePercent != null && kpis.attendancePercent < MIN_ATTENDANCE_PERCENT
                    ? colors.danger
                    : colors.text
                }
              />
              <StatTile
                label="Em risco"
                value={String(kpis?.atRiskStudents ?? 0)}
                hint="Recuperação ou reprovação"
                color={kpis?.atRiskStudents ? colors.danger : colors.text}
              />
              <StatTile
                label="Avaliações"
                value={`${kpis?.assessments.completed ?? 0}/${kpis?.assessments.total ?? 0}`}
                hint="Concluídas no bimestre"
              />
            </View>
          ),
        },
        {
          key: "status",
          render: () => (
            <Section
              title="Situação dos alunos"
              subtitle="Pior situação entre as disciplinas"
              empty={!kpis?.students}
            >
              <StatusDonut summary={data.statusSummary} />
            </Section>
          ),
        },
        {
          key: "status-discipline",
          render: () => (
            <Section title="Situação por disciplina" empty={!data.statusByDiscipline.length}>
              <StatusByDisciplineChart items={data.statusByDiscipline} />
            </Section>
          ),
        },
        {
          key: "term-averages",
          render: () => {
            const discipline = filters.disciplineName ?? OVERALL;
            const series = reportCards.map((card) => ({
              label: card.className,
              terms: classYear(card, discipline).terms,
            }));
            return (
              <Section
                title="Média da turma por bimestre"
                subtitle={`Média oficial · aprovação em ${PASSING_AVERAGE}`}
                empty={!series.some((item) => item.terms.some((value) => value !== null))}
              >
                <TermLineChart series={series} />
              </Section>
            );
          },
        },
        {
          key: "class-attendance",
          render: () => (
            <Section
              title="Turmas com mais faltas"
              subtitle="Frequência no bimestre (justificadas não contam)"
              empty={!data.attendance.classes.length}
              emptyMessage="Nenhuma chamada registrada no bimestre."
            >
              <PercentBars
                items={data.attendance.classes.map((item) => ({
                  label: item.className,
                  value: item.attendancePercent,
                }))}
              />
            </Section>
          ),
        },
        {
          key: "student-attendance",
          render: () => (
            <Section
              title="Alunos com mais faltas"
              subtitle={`Em vermelho: abaixo de ${MIN_ATTENDANCE_PERCENT}%`}
              empty={!data.attendance.students.length}
              emptyMessage="Nenhuma chamada registrada no bimestre."
            >
              <AbsenceList students={data.attendance.students} onPress={openStudent} />
            </Section>
          ),
        },
        {
          key: "ranking",
          render: () => {
            const rows = rankingRows();
            return (
              <Section title="Desempenho dos alunos" subtitle="Média geral no bimestre">
                <ChipGroup
                  value={rankingMode}
                  onChange={setRankingMode}
                  options={[
                    { value: "best", label: "Melhores" },
                    { value: "worst", label: "Atenção" },
                    { value: "risers", label: "Subiram" },
                    { value: "fallers", label: "Caíram" },
                  ]}
                />
                {rows.length ? (
                  <RankingList rows={rows} />
                ) : (
                  <Text style={styles.muted}>
                    {data.term === 1 && (rankingMode === "risers" || rankingMode === "fallers")
                      ? "Disponível a partir do 2º bimestre."
                      : "Sem dados para os filtros selecionados."}
                  </Text>
                )}
              </Section>
            );
          },
        },
        {
          key: "assessments",
          render: () => (
            <Section
              title="Notas das avaliações"
              subtitle="Média 0–10 · menor–maior nota"
              empty={!data.assessments.length}
              emptyMessage="Nenhuma avaliação no bimestre."
            >
              <AssessmentRows
                assessments={data.assessments}
                onPress={(assessment) =>
                  router.push({ pathname: "/avaliacao", params: { id: assessment.id } })
                }
              />
            </Section>
          ),
        },
        {
          key: "report-cards",
          render: () => (
            <Section
              title="Médias da turma e de cada aluno"
              subtitle="Por bimestre e anual (média simples dos bimestres)"
              empty={!reportCards.length}
            >
              <ReportCardView
                reportCards={reportCards}
                disciplineName={filters.disciplineName}
                onSelectStudent={(card, student) =>
                  openStudent({ classId: card.classId, studentId: student.studentId })
                }
              />
            </Section>
          ),
        },
      ]
    : [];

  return (
    <>
      <FlatList
        style={styles.screen}
        contentContainerStyle={styles.content}
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => item.render()}
        initialNumToRender={4}
        windowSize={7}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isPending} onRefresh={() => void refetch()} />
        }
        ListHeaderComponent={
          <View style={screenStyles.header}>
            <View style={screenStyles.headerText}>
              <Text style={styles.title}>Olá, {user?.name}</Text>
              {data ? (
                <Text style={styles.subtitle}>
                  {termLabel(data.term)} de {data.schoolYear}
                  {filters.classId
                    ? ` · ${data.classes.find((item) => item.id === filters.classId)?.name ?? ""}`
                    : ""}
                  {filters.disciplineName ? ` · ${filters.disciplineName}` : ""}
                </Text>
              ) : null}
            </View>
            {data ? (
              <Button title="Filtros" variant="outline" onPress={() => setFiltersOpen(true)} style={screenStyles.filterButton} />
            ) : null}
            {error ? <Banner message={error.message} /> : null}
            {data && !data.classes.length ? (
              <Banner tone="info" message="Você ainda não tem turmas atribuídas neste ano letivo." />
            ) : null}
          </View>
        }
      />
      {data ? (
        <FiltersModal
          visible={filtersOpen}
          initial={{ ...filters, schoolYear: data.schoolYear, term: data.term }}
          classes={data.classes}
          onApply={setFilters}
          onClose={() => setFiltersOpen(false)}
        />
      ) : null}
    </>
  );
}

const screenStyles = StyleSheet.create({
  header: { gap: spacing(1), marginBottom: spacing(0.5) },
  headerText: { gap: 2 },
  filterButton: { minHeight: 40, alignSelf: "flex-start" },
  tiles: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1) },
});
