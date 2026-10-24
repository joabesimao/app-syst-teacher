import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { errorMessage } from "@/core/domain/errors";
import { requireParams } from "@/shared/navigation";
import { Banner, Button, Card, commonStyles, EmptyState, Loading } from "@/shared/ui";
import type { ConsolidationCells, ConsolidationSheet, SheetStudent } from "../../../domain/models";
import { answeredItems, changedResponses } from "../../../domain/rules";
import { RESPONSES_LOCKED_MESSAGE } from "../../../domain/usecases";
import { ScaleSelector } from "../../components/ScaleSelector";
import { useConsolidationSheet } from "../../hooks/useConsolidationSheet";
import { useSaveResponses } from "../../hooks/useConsolidationMutations";
import { styles } from "./styles";

interface StudentFormProps {
  sheet: ConsolidationSheet;
  student: SheetStudent;
  position: number;
  onNavigate: (offset: number) => void;
}

function StudentForm({ sheet, student, position, onNavigate }: StudentFormProps) {
  const [cells, setCells] = useState<ConsolidationCells>(() =>
    Object.fromEntries(sheet.template.items.map((item) => [item.id, student.responses[item.id] ?? null]))
  );
  const { mutate, isPending, error } = useSaveResponses();
  const editable = sheet.consolidation.status === "IN_PROGRESS";
  const isLast = position === sheet.students.length - 1;

  const save = (offset: number) =>
    mutate(
      {
        consolidationId: sheet.consolidation.id,
        status: sheet.consolidation.status,
        responses: changedResponses([student], { [student.studentId]: cells }),
      },
      { onSuccess: () => (offset === 0 ? router.back() : onNavigate(offset)) }
    );

  return (
    <ScrollView
      style={commonStyles.screen}
      contentContainerStyle={commonStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ title: student.fullName }} />
      <Text style={commonStyles.subtitle}>
        Aluno {position + 1} de {sheet.students.length} · {answeredItems(cells)} de {sheet.template.items.length}{" "}
        itens · Matrícula {student.registration}
        {student.transferred ? " · transferido" : ""}
      </Text>
      {editable ? (
        <Text style={commonStyles.muted}>Toque de novo na opção marcada para limpar.</Text>
      ) : (
        <Banner tone="info" message={RESPONSES_LOCKED_MESSAGE} />
      )}
      <Card style={styles.card}>
        {sheet.template.items.map((item) => (
          <ScaleSelector
            key={item.id}
            label={item.label}
            options={sheet.template.options}
            value={cells[item.id] ?? null}
            editable={editable}
            onChange={(optionId) => setCells((current) => ({ ...current, [item.id]: optionId }))}
          />
        ))}
      </Card>
      {error ? <Banner message={errorMessage(error, "Não foi possível salvar as respostas")} /> : null}
      {editable ? (
        <View style={styles.actions}>
          <Button
            title={isLast ? "Salvar e voltar à tabela" : "Salvar e próximo aluno"}
            loading={isPending}
            onPress={() => save(isLast ? 0 : 1)}
          />
          <View style={styles.row}>
            <Button
              variant="outline"
              title="Anterior"
              disabled={position === 0 || isPending}
              onPress={() => save(-1)}
              style={commonStyles.grow}
            />
            <Button
              variant="outline"
              title="Salvar"
              disabled={isPending}
              onPress={() => save(0)}
              style={commonStyles.grow}
            />
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

export function LaunchResponsesScreen() {
  const params = requireParams(useLocalSearchParams(), ["consolidationId", "studentId"] as const);
  const { data, isPending, error, refetch } = useConsolidationSheet(params?.consolidationId);

  if (!params) return <EmptyState message="Consolidação não encontrada." />;
  if (isPending) return <Loading />;
  if (!data) {
    return (
      <View style={styles.container}>
        <Banner message={errorMessage(error, "Não foi possível carregar a consolidação")} onAction={() => void refetch()} />
      </View>
    );
  }

  const position = data.students.findIndex((student) => student.studentId === params.studentId);
  const student = data.students[position];
  if (!student) return <EmptyState message="Aluno não encontrado nesta consolidação." />;

  const navigate = (offset: number) => {
    const next = data.students[position + offset];
    if (next) {
      router.setParams({ studentId: next.studentId });
    }
  };

  return (
    <StudentForm key={student.studentId} sheet={data} student={student} position={position} onNavigate={navigate} />
  );
}
