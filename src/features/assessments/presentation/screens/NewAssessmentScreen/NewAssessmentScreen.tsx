import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { errorMessage } from "@/core/domain/errors";
import { useCurrentTeacherId } from "@/features/auth";
import { todayIso } from "@/shared/format";
import { requireParams } from "@/shared/navigation";
import type { ChipOption } from "@/shared/ui";
import { Banner, Button, Card, ChipGroup, commonStyles, EmptyState, Field } from "@/shared/ui";
import type { AssessmentDraft, AssessmentKind, InitialAssessmentStatus } from "../../../domain/models";
import { useCreateAssessment } from "../../hooks/useCreateAssessment";
import { ASSESSMENT_KIND_LABELS, ASSESSMENT_STATUS_LABELS, INITIAL_STATUS_HINTS } from "../../labels";
import { styles } from "./styles";

const KIND_OPTIONS: ChipOption<AssessmentKind>[] = (["REGULAR", "RECOVERY"] as const).map((kind) => ({
  value: kind,
  label: ASSESSMENT_KIND_LABELS[kind].label,
}));

const STATUS_OPTIONS: ChipOption<InitialAssessmentStatus>[] = (["IN_PROGRESS", "PLANNED"] as const).map(
  (status) => ({ value: status, label: ASSESSMENT_STATUS_LABELS[status].label })
);

const emptyDraft = (): AssessmentDraft => ({
  title: "",
  kind: "REGULAR",
  dueDate: todayIso(),
  maxScore: "10",
  weight: "1",
  status: "IN_PROGRESS",
});

export function NewAssessmentScreen() {
  const params = requireParams(useLocalSearchParams(), ["classId", "discipline", "className"] as const);
  const teacherId = useCurrentTeacherId();
  const [draft, setDraft] = useState(emptyDraft);
  const { mutate, isPending, error } = useCreateAssessment();

  if (!params) return <EmptyState message="Turma não encontrada." />;

  const change = <K extends keyof AssessmentDraft>(key: K) => (value: AssessmentDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const save = () =>
    mutate(
      { classId: params.classId, disciplineName: params.discipline, teacherId, draft },
      { onSuccess: () => router.back() }
    );

  return (
    <ScrollView
      style={commonStyles.screen}
      contentContainerStyle={commonStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ title: `Nova avaliação · ${params.className}` }} />
      <Text style={commonStyles.subtitle}>{params.discipline}</Text>
      <Card style={styles.card}>
        <Field label="Título" value={draft.title} onChangeText={change("title")} placeholder="Ex.: Prova 1" />
        <View style={styles.group}>
          <ChipGroup label="Tipo" options={KIND_OPTIONS} value={draft.kind} onChange={change("kind")} />
          <Text style={commonStyles.muted}>{ASSESSMENT_KIND_LABELS[draft.kind].hint}</Text>
        </View>
        <View style={styles.group}>
          <Field
            label="Data de entrega (AAAA-MM-DD)"
            value={draft.dueDate}
            onChangeText={change("dueDate")}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
          <Text style={commonStyles.muted}>O bimestre é definido pela data de entrega.</Text>
        </View>
        <View style={styles.row}>
          <View style={commonStyles.grow}>
            <Field
              label="Nota máxima"
              value={draft.maxScore}
              onChangeText={change("maxScore")}
              keyboardType="decimal-pad"
            />
          </View>
          {draft.kind === "RECOVERY" ? null : (
            <View style={commonStyles.grow}>
              <Field label="Peso" value={draft.weight} onChangeText={change("weight")} keyboardType="decimal-pad" />
            </View>
          )}
        </View>
        <View style={styles.group}>
          <ChipGroup label="Status inicial" options={STATUS_OPTIONS} value={draft.status} onChange={change("status")} />
          <Text style={commonStyles.muted}>{INITIAL_STATUS_HINTS[draft.status]}</Text>
        </View>
      </Card>
      {error ? <Banner message={errorMessage(error, "Não foi possível criar a avaliação")} /> : null}
      <Button title="Criar avaliação" onPress={save} loading={isPending} />
    </ScrollView>
  );
}
