import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { errorMessage } from "@/core/domain/errors";
import { useCurrentUser } from "@/features/auth";
import type { ChipOption } from "@/shared/ui";
import { Banner, Button, Card, ChipGroup, commonStyles, Field } from "@/shared/ui";
import type { SchoolClassDraft, SchoolShift } from "../../../domain/models";
import { useCreateClass } from "../../hooks/useCreateClass";
import { SHIFT_LABELS } from "../../labels";
import { styles } from "./styles";

type ShiftOption = SchoolShift | "NONE";

const SHIFT_OPTIONS: ChipOption<ShiftOption>[] = [
  { value: "NONE", label: "Não informar" },
  ...(Object.keys(SHIFT_LABELS) as SchoolShift[]).map((shift) => ({ value: shift, label: SHIFT_LABELS[shift] })),
];

const emptyDraft = (): SchoolClassDraft => ({
  name: "",
  gradeLevel: "",
  schoolYear: String(new Date().getFullYear()),
  shift: null,
  disciplineName: "",
});

export function NewClassScreen() {
  const user = useCurrentUser();
  const [draft, setDraft] = useState(emptyDraft);
  const { mutate, isPending, error } = useCreateClass();
  const isTeacher = user?.role === "TEACHER";
  const linkedToTeacher = !!user?.teacherId;

  const change = <K extends keyof SchoolClassDraft>(key: K) => (value: SchoolClassDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const save = () => mutate({ draft, requiresDiscipline: isTeacher }, { onSuccess: () => router.back() });

  return (
    <ScrollView
      style={commonStyles.screen}
      contentContainerStyle={commonStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Card style={styles.card}>
        <Field label="Nome da turma" value={draft.name} onChangeText={change("name")} placeholder="Ex.: 7º A" />
        <Field
          label="Série/ano"
          value={draft.gradeLevel}
          onChangeText={change("gradeLevel")}
          placeholder="Ex.: 7º ano"
        />
        <Field
          label="Ano letivo"
          value={draft.schoolYear}
          onChangeText={change("schoolYear")}
          keyboardType="number-pad"
          maxLength={4}
        />
        <ChipGroup
          label="Turno"
          options={SHIFT_OPTIONS}
          value={draft.shift ?? "NONE"}
          onChange={(value) => change("shift")(value === "NONE" ? null : value)}
        />
        {linkedToTeacher ? (
          <View style={styles.group}>
            <Field
              label={isTeacher ? "Disciplina que você leciona" : "Disciplina que você leciona (opcional)"}
              value={draft.disciplineName}
              onChangeText={change("disciplineName")}
              placeholder="Ex.: Matemática"
            />
            <Text style={commonStyles.muted}>A turma aparecerá em “Minhas turmas” com esta disciplina.</Text>
          </View>
        ) : null}
      </Card>
      {error ? <Banner message={errorMessage(error, "Não foi possível cadastrar a turma")} /> : null}
      <Button title="Cadastrar turma" onPress={save} loading={isPending} />
    </ScrollView>
  );
}
