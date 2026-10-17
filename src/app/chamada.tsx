import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Banner, Button, Card, Field, Loading, styles } from "../components/ui";
import { useAsync } from "../hooks/useAsync";
import {
  createLesson,
  loadLessonAttendance,
  loadStudents,
  saveLessonAttendance,
  updateLesson,
} from "../services/schoolApi";
import { useAuthStore } from "../store/useAuthStore";
import { colors, spacing } from "../theme";
import type { AttendanceStatus } from "../types/domain";
import { ATTENDANCE_STATUS, formatDate, todayIso } from "../utils/labels";

type Row = { studentId: string; fullName: string; status: AttendanceStatus };

type AttendanceDraft = { date: string; lessonCount: number; topic: string; rows: Row[] };

const STATUS_ORDER: AttendanceStatus[] = ["PRESENT", "ABSENT", "JUSTIFIED"];

const STATUS_COLORS: Record<AttendanceStatus, { color: string; background: string }> = {
  PRESENT: { color: colors.success, background: colors.successSoft },
  ABSENT: { color: colors.danger, background: colors.dangerSoft },
  JUSTIFIED: { color: colors.warning, background: colors.warningSoft },
};

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function AttendanceScreen() {
  const { classId, discipline, className, lessonId } = useLocalSearchParams<{
    classId: string;
    discipline: string;
    className: string;
    lessonId?: string;
  }>();
  const teacherId = useAuthStore((state) => state.user?.teacherId ?? undefined);

  const { data, error: loadError, loading } = useAsync(
    useCallback(async (): Promise<AttendanceDraft> => {
      if (lessonId) {
        const attendance = await loadLessonAttendance(lessonId);
        return {
          date: attendance.lesson.date,
          lessonCount: attendance.lesson.lessonCount,
          topic: attendance.lesson.topic ?? "",
          rows: attendance.students.map((student): Row => ({
            studentId: student.studentId,
            fullName: student.fullName,
            status: student.status ?? "PRESENT",
          })),
        };
      }
      const students = await loadStudents({ classId });
      return {
        date: todayIso(),
        lessonCount: 1,
        topic: "",
        rows: students
          .filter((student) => student.isActive)
          .map((student) => ({ studentId: student.id, fullName: student.fullName, status: "PRESENT" as const })),
      };
    }, [classId, lessonId])
  );

  if (loading && !data) return <Loading />;
  if (!data) return <View style={styles.content}>{loadError ? <Banner message={loadError} /> : null}</View>;

  return (
    <AttendanceForm
      initial={data}
      classId={classId}
      discipline={discipline}
      className={className}
      lessonId={lessonId}
      teacherId={teacherId}
    />
  );
}

function AttendanceForm({
  initial,
  classId,
  discipline,
  className,
  lessonId,
  teacherId,
}: {
  initial: AttendanceDraft;
  classId: string;
  discipline: string;
  className: string;
  lessonId?: string;
  teacherId?: string;
}) {
  const [date, setDate] = useState(initial.date);
  const [lessonCount, setLessonCount] = useState(initial.lessonCount);
  const [topic, setTopic] = useState(initial.topic);
  const [rows, setRows] = useState<Row[]>(() =>
    [...initial.rows].sort((a, b) => a.fullName.localeCompare(b.fullName, "pt-BR"))
  );
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const setStatus = (studentId: string, status: AttendanceStatus) =>
    setRows((current) => current.map((row) => (row.studentId === studentId ? { ...row, status } : row)));

  const counts = STATUS_ORDER.map((status) => rows.filter((row) => row.status === status).length);

  const save = async () => {
    if (!DAY_PATTERN.test(date)) {
      setError("Data inválida. Use o formato AAAA-MM-DD");
      return;
    }
    if (!teacherId || rows.length === 0) {
      setError("Não há alunos para registrar");
      return;
    }
    setError(undefined);
    setSaving(true);
    const records = rows.map(({ studentId, status }) => ({ studentId, status }));
    try {
      if (lessonId) {
        await updateLesson(lessonId, { date, lessonCount, topic });
        await saveLessonAttendance(lessonId, records);
      } else {
        await createLesson({ classId, teacherId, disciplineName: discipline, date, lessonCount, topic, records });
      }
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a chamada");
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen
        options={{ title: lessonId ? `Chamada de ${formatDate(date)}` : `Nova chamada · ${className}` }}
      />
      <Text style={styles.subtitle}>{discipline}</Text>

      <Card style={{ gap: spacing(1.5) }}>
        <Field
          label="Data (AAAA-MM-DD)"
          value={date}
          onChangeText={setDate}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />
        <View style={styles.field}>
          <Text style={styles.label}>Quantidade de aulas</Text>
          <View style={styles.row}>
            <Button
              variant="outline"
              title="−"
              onPress={() => setLessonCount((count) => Math.max(1, count - 1))}
              style={{ width: 48 }}
            />
            <Text style={[styles.title, { minWidth: 32, textAlign: "center" }]}>{lessonCount}</Text>
            <Button
              variant="outline"
              title="+"
              onPress={() => setLessonCount((count) => Math.min(10, count + 1))}
              style={{ width: 48 }}
            />
          </View>
        </View>
        <Field label="Conteúdo da aula (opcional)" value={topic} onChangeText={setTopic} />
      </Card>

      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Text style={styles.sectionTitle}>Alunos ({rows.length})</Text>
        <Text style={styles.muted}>
          {counts[0]} P · {counts[1]} F · {counts[2]} J
        </Text>
      </View>

      {rows.map((row) => (
        <Card key={row.studentId} style={{ gap: spacing(1) }}>
          <Text style={styles.text}>{row.fullName}</Text>
          <View style={styles.row}>
            {STATUS_ORDER.map((status) => {
              const selected = row.status === status;
              return (
                <Pressable
                  key={status}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${row.fullName}: ${ATTENDANCE_STATUS[status].label}`}
                  onPress={() => setStatus(row.studentId, status)}
                  style={{
                    flex: 1,
                    minHeight: 40,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: selected ? STATUS_COLORS[status].color : colors.border,
                    backgroundColor: selected ? STATUS_COLORS[status].background : colors.surface,
                  }}
                >
                  <Text
                    style={{ fontWeight: "600", color: selected ? STATUS_COLORS[status].color : colors.muted }}
                  >
                    {ATTENDANCE_STATUS[status].label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      ))}

      {error ? <Banner message={error} /> : null}
      <Button title={lessonId ? "Salvar alterações" : "Registrar chamada"} onPress={save} loading={saving} />
    </ScrollView>
  );
}
