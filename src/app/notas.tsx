import { useCallback, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Banner, Button, Card, Loading, styles } from "../components/ui";
import { useAsync } from "../hooks/useAsync";
import { loadAssessmentGrades, saveAssessmentGrades } from "../services/schoolApi";
import { spacing } from "../theme";
import type { AssessmentGrades, AssessmentStatus } from "../types/domain";
import { ASSESSMENT_STATUS, formatNumber } from "../utils/labels";

type Row = { studentId: string; fullName: string; registration: string; score: string };

const toInput = (score: number | null) => (score === null ? "" : String(score).replace(".", ","));

const parseScore = (value: string) => Number(value.replace(",", ".").trim());

export default function GradesScreen() {
  const { assessmentId, classId, title, maxScore: maxScoreParam, status } = useLocalSearchParams<{
    assessmentId: string;
    classId: string;
    title: string;
    maxScore: string;
    status: AssessmentStatus;
  }>();
  const { data, error: loadError, loading } = useAsync(
    useCallback(() => loadAssessmentGrades(assessmentId, classId), [assessmentId, classId])
  );

  if (loading && !data) return <Loading />;
  if (!data) return <View style={styles.content}>{loadError ? <Banner message={loadError} /> : null}</View>;

  return (
    <GradesForm
      grades={data}
      assessmentId={assessmentId}
      title={title}
      maxScore={Number(maxScoreParam)}
      status={status}
    />
  );
}

function GradesForm({
  grades,
  assessmentId,
  title,
  maxScore,
  status,
}: {
  grades: AssessmentGrades;
  assessmentId: string;
  title: string;
  maxScore: number;
  status: AssessmentStatus;
}) {
  const editable = status === "IN_PROGRESS";
  const [rows, setRows] = useState<Row[]>(() =>
    grades.students
      .map((student) => ({
        studentId: student.studentId,
        fullName: student.fullName,
        registration: student.registration,
        score: toInput(student.score),
      }))
      .sort((a, b) => a.fullName.localeCompare(b.fullName, "pt-BR"))
  );
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const setScore = (studentId: string, score: string) =>
    setRows((current) => current.map((row) => (row.studentId === studentId ? { ...row, score } : row)));

  const save = async () => {
    const filled = rows.filter((row) => row.score.trim() !== "");
    const invalid = filled.find((row) => {
      const score = parseScore(row.score);
      return Number.isNaN(score) || score < 0 || score > maxScore;
    });
    if (invalid) {
      setError(`Nota inválida para ${invalid.fullName}. Use um valor entre 0 e ${formatNumber(maxScore)}`);
      return;
    }
    if (filled.length === 0) {
      setError("Informe ao menos uma nota");
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      await saveAssessmentGrades(
        assessmentId,
        filled.map((row) => ({ studentId: row.studentId, score: parseScore(row.score) }))
      );
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar as notas");
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title }} />
      <Text style={styles.subtitle}>
        Nota máxima {formatNumber(maxScore)} · {ASSESSMENT_STATUS[status].label}
      </Text>
      {editable ? null : (
        <Banner
          tone="info"
          message="As notas só podem ser lançadas com a avaliação Em andamento. Altere o status pelo sistema web."
        />
      )}

      {rows.map((row) => (
        <Card
          key={row.studentId}
          style={{ flexDirection: "row", alignItems: "center", gap: spacing(1.5) }}
        >
          <Text style={[styles.text, { flex: 1 }]}>
            {row.fullName}
            {"\n"}
            <Text style={styles.muted}>Matrícula {row.registration}</Text>
          </Text>
          <TextInput
            accessibilityLabel={`Nota de ${row.fullName}`}
            value={row.score}
            onChangeText={(value) => setScore(row.studentId, value)}
            editable={editable}
            keyboardType="decimal-pad"
            placeholder="—"
            maxLength={6}
            style={[styles.input, { width: 80, textAlign: "center" }, !editable && { opacity: 0.6 }]}
          />
        </Card>
      ))}

      {error ? <Banner message={error} /> : null}
      {editable ? <Button title="Salvar notas" onPress={save} loading={saving} /> : null}
    </ScrollView>
  );
}
