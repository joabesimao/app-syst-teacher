import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { errorMessage } from "@/core/domain/errors";
import { readParam, routes } from "@/shared/navigation";
import { Banner, Button, commonStyles, EmptyState, Loading, SegmentedControl } from "@/shared/ui";
import type { CellDisplay, ConsolidationSheet, SheetStudent } from "../../../domain/models";
import { consolidationLabel } from "../../../domain/rules";
import { RESPONSES_LOCKED_MESSAGE } from "../../../domain/usecases";
import { ConsolidationTable } from "../../components/ConsolidationTable";
import { SheetHeader } from "../../components/SheetHeader";
import { useConsolidationSheet } from "../../hooks/useConsolidationSheet";
import { useDeleteConsolidation, useUpdateConsolidationStatus } from "../../hooks/useConsolidationMutations";
import { CELL_DISPLAY_SEGMENTS } from "../../labels";
import { styles } from "./styles";

const firstPending = (sheet: ConsolidationSheet) => {
  const pending = new Set(sheet.summary.students.filter((student) => !student.complete).map((s) => s.studentId));
  return sheet.students.find((student) => pending.has(student.studentId)) ?? sheet.students[0];
};

export function ConsolidationScreen() {
  const consolidationId = readParam(useLocalSearchParams(), "consolidationId");
  const [display, setDisplay] = useState<CellDisplay>("text");
  const { data, error, isPending, refetch } = useConsolidationSheet(consolidationId);
  const status = useUpdateConsolidationStatus(consolidationId ?? "");
  const removal = useDeleteConsolidation();

  if (!consolidationId) return <EmptyState message="Consolidação não encontrada." />;
  if (isPending) return <Loading />;
  if (!data) {
    return (
      <View style={styles.container}>
        <Banner
          message={errorMessage(error, "Não foi possível carregar a consolidação")}
          onAction={() => void refetch()}
        />
      </View>
    );
  }

  const editable = data.consolidation.status === "IN_PROGRESS";
  const launch = (student: SheetStudent | undefined) =>
    student && router.push(routes.launchConsolidation({ consolidationId, studentId: student.studentId }));

  const confirmDelete = () =>
    Alert.alert("Excluir consolidação", "As respostas lançadas serão apagadas. Deseja continuar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => removal.mutate(consolidationId, { onSuccess: () => router.back() }),
      },
    ]);

  const actionError = status.error ?? removal.error;

  return (
    <ScrollView style={commonStyles.screen} contentContainerStyle={commonStyles.content}>
      <Stack.Screen
        options={{
          title: consolidationLabel({ title: data.consolidation.title, templateName: data.template.name }),
        }}
      />
      <SheetHeader sheet={data} />
      {editable ? null : <Banner tone="info" message={RESPONSES_LOCKED_MESSAGE} />}
      <SegmentedControl segments={CELL_DISPLAY_SEGMENTS} value={display} onChange={setDisplay} />
      {data.students.length ? (
        <ConsolidationTable sheet={data} display={display} onStudentPress={launch} />
      ) : (
        <EmptyState message="Nenhum aluno matriculado na data da consolidação." />
      )}
      {actionError ? <Banner message={errorMessage(actionError, "Não foi possível concluir a ação")} /> : null}
      <View style={styles.actions}>
        {editable && data.students.length ? (
          <Button title="Lançar respostas" onPress={() => launch(firstPending(data))} />
        ) : null}
        <Button
          variant="outline"
          title={editable ? "Concluir consolidação" : "Reabrir consolidação"}
          loading={status.isPending}
          onPress={() => status.mutate(editable ? "COMPLETED" : "IN_PROGRESS")}
        />
        {editable ? (
          <Button variant="ghost" title="Excluir" loading={removal.isPending} onPress={confirmDelete} />
        ) : null}
      </View>
    </ScrollView>
  );
}
