import { useState } from "react";
import { ScrollView, Text } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { errorMessage } from "@/core/domain/errors";
import { requireParams } from "@/shared/navigation";
import { Banner, Button, Card, commonStyles, EmptyState, Field } from "@/shared/ui";
import type { StudentDraft } from "../../../domain/models";
import { useCreateStudent } from "../../hooks/useCreateStudent";
import { styles } from "./styles";

const emptyDraft = (): StudentDraft => ({ fullName: "", registration: "", birthDate: "", email: "", phone: "" });

export function NewStudentScreen() {
  const params = requireParams(useLocalSearchParams(), ["classId", "className"] as const);
  const [draft, setDraft] = useState(emptyDraft);
  const { mutate, isPending, error } = useCreateStudent();

  if (!params) return <EmptyState message="Turma não encontrada." />;

  const change = (key: keyof StudentDraft) => (value: string) => setDraft((current) => ({ ...current, [key]: value }));

  const save = () => mutate({ classId: params.classId, draft }, { onSuccess: () => router.back() });

  return (
    <ScrollView
      style={commonStyles.screen}
      contentContainerStyle={commonStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ title: `Novo aluno · ${params.className}` }} />
      <Card style={styles.card}>
        <Field
          label="Nome completo"
          value={draft.fullName}
          onChangeText={change("fullName")}
          autoCapitalize="words"
          placeholder="Ex.: Ana Souza"
        />
        <Field
          label="Matrícula"
          value={draft.registration}
          onChangeText={change("registration")}
          autoCapitalize="characters"
          placeholder="Ex.: 2026001"
        />
        <Field
          label="Data de nascimento (AAAA-MM-DD)"
          value={draft.birthDate}
          onChangeText={change("birthDate")}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          placeholder="Opcional"
        />
        <Field
          label="E-mail"
          value={draft.email}
          onChangeText={change("email")}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Opcional"
        />
        <Field
          label="Telefone"
          value={draft.phone}
          onChangeText={change("phone")}
          keyboardType="phone-pad"
          placeholder="Opcional"
        />
        <Text style={commonStyles.muted}>A matrícula na turma começa hoje.</Text>
      </Card>
      {error ? <Banner message={errorMessage(error, "Não foi possível cadastrar o aluno")} /> : null}
      <Button title="Cadastrar aluno" onPress={save} loading={isPending} />
    </ScrollView>
  );
}
