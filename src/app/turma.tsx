import { useCallback, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Banner, Button, Card, Chip, EmptyState, Loading, styles } from "../components/ui";
import { useAsync } from "../hooks/useAsync";
import { loadAssessments, loadLessons, loadStudents } from "../services/schoolApi";
import { useAuthStore } from "../store/useAuthStore";
import { colors, spacing } from "../theme";
import type { Assessment, Lesson, Student } from "../types/domain";
import { ASSESSMENT_STATUS, formatDate, formatNumber, sameDiscipline, termLabel } from "../utils/labels";

type Tab = "chamadas" | "avaliacoes" | "alunos";

const TABS: { key: Tab; label: string }[] = [
  { key: "chamadas", label: "Chamadas" },
  { key: "avaliacoes", label: "Avaliações" },
  { key: "alunos", label: "Alunos" },
];

const STATUS_COLORS = {
  PLANNED: { color: colors.muted, background: "#F4F4F5" },
  IN_PROGRESS: { color: colors.primaryDark, background: colors.infoSoft },
  COMPLETED: { color: colors.success, background: colors.successSoft },
};

export default function ClassScreen() {
  const { classId, discipline, className } = useLocalSearchParams<{
    classId: string;
    discipline: string;
    className: string;
  }>();
  const teacherId = useAuthStore((state) => state.user?.teacherId ?? undefined);
  const [tab, setTab] = useState<Tab>("chamadas");

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: `${className} · ${discipline}` }} />
      <View style={[styles.row, { padding: spacing(2), paddingBottom: 0 }]}>
        {TABS.map((item) => (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === item.key }}
            onPress={() => setTab(item.key)}
            style={{
              flex: 1,
              paddingVertical: spacing(1),
              borderRadius: 8,
              alignItems: "center",
              backgroundColor: tab === item.key ? colors.surface : "transparent",
              borderWidth: tab === item.key ? 1 : 0,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontWeight: "600", color: tab === item.key ? colors.text : colors.muted }}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {tab === "chamadas" ? (
        <LessonsTab classId={classId} discipline={discipline} className={className} teacherId={teacherId} />
      ) : null}
      {tab === "avaliacoes" ? (
        <AssessmentsTab classId={classId} discipline={discipline} teacherId={teacherId} />
      ) : null}
      {tab === "alunos" ? <StudentsTab classId={classId} /> : null}
    </View>
  );
}

function LessonsTab({
  classId,
  discipline,
  className,
  teacherId,
}: {
  classId: string;
  discipline: string;
  className: string;
  teacherId?: string;
}) {
  const { data, error, loading, reload } = useAsync<Lesson[]>(
    useCallback(
      () => loadLessons({ classId, teacherId, disciplineName: discipline }),
      [classId, teacherId, discipline]
    ),
    { refetchOnFocus: true }
  );

  const lessons = [...(data ?? [])].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={lessons}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={loading && !!data} onRefresh={reload} />}
      ListHeaderComponent={
        <View style={{ gap: spacing(1.5) }}>
          <Button
            title="Nova chamada"
            onPress={() => router.push({ pathname: "/chamada", params: { classId, discipline, className } })}
          />
          {error ? <Banner message={error} /> : null}
          {loading && !data ? <Loading /> : null}
        </View>
      }
      ListEmptyComponent={loading || error ? null : <EmptyState message="Nenhuma chamada registrada." />}
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({ pathname: "/chamada", params: { classId, discipline, className, lessonId: item.id } })
          }
        >
          <Card>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <Text style={styles.sectionTitle}>{formatDate(item.date)}</Text>
              <Text style={styles.muted}>
                {item.lessonCount} {item.lessonCount === 1 ? "aula" : "aulas"} · {termLabel(item.academicTerm)}
              </Text>
            </View>
            {item.topic ? <Text style={styles.text}>{item.topic}</Text> : null}
            {item.attendance ? (
              <Text style={styles.muted}>
                {item.attendance.present} presentes · {item.attendance.absent} faltas ·{" "}
                {item.attendance.justified} justificadas
              </Text>
            ) : null}
          </Card>
        </Pressable>
      )}
    />
  );
}

function AssessmentsTab({
  classId,
  discipline,
  teacherId,
}: {
  classId: string;
  discipline: string;
  teacherId?: string;
}) {
  const { data, error, loading, reload } = useAsync<Assessment[]>(
    useCallback(() => loadAssessments({ classId, teacherId }), [classId, teacherId]),
    { refetchOnFocus: true }
  );

  const assessments = (data ?? [])
    .filter((assessment) => sameDiscipline(assessment.discipline, discipline))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={assessments}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={loading && !!data} onRefresh={reload} />}
      ListHeaderComponent={
        <>
          {error ? <Banner message={error} /> : null}
          {loading && !data ? <Loading /> : null}
        </>
      }
      ListEmptyComponent={loading || error ? null : <EmptyState message="Nenhuma avaliação nesta disciplina." />}
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: "/notas",
              params: {
                assessmentId: item.id,
                classId,
                title: item.title,
                maxScore: String(item.maxScore),
                status: item.status,
              },
            })
          }
        >
          <Card>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <Text style={[styles.sectionTitle, { flex: 1 }]}>{item.title}</Text>
              <Chip label={ASSESSMENT_STATUS[item.status].label} {...STATUS_COLORS[item.status]} />
            </View>
            <Text style={styles.muted}>
              {termLabel(item.academicTerm)} · Entrega {formatDate(item.dueDate)} · Nota máx.{" "}
              {formatNumber(item.maxScore)} · Peso {formatNumber(item.weight)}
            </Text>
          </Card>
        </Pressable>
      )}
    />
  );
}

function StudentsTab({ classId }: { classId: string }) {
  const { data, error, loading, reload } = useAsync<Student[]>(
    useCallback(() => loadStudents({ classId }), [classId])
  );

  const students = [...(data ?? [])].sort((a, b) => a.fullName.localeCompare(b.fullName, "pt-BR"));

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={students}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={loading && !!data} onRefresh={reload} />}
      ListHeaderComponent={
        <>
          {error ? <Banner message={error} /> : null}
          {loading && !data ? <Loading /> : null}
        </>
      }
      ListEmptyComponent={loading || error ? null : <EmptyState message="Nenhum aluno nesta turma." />}
      renderItem={({ item }) => (
        <Card>
          <Text style={styles.text}>{item.fullName}</Text>
          <Text style={styles.muted}>
            Matrícula {item.registration}
            {item.isActive ? "" : " · Inativo"}
          </Text>
        </Card>
      )}
    />
  );
}
