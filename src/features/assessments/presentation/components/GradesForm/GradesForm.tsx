import { useCallback } from "react";
import { FlatList, Text, View } from "react-native";
import type { ListRenderItem } from "react-native";
import { router, Stack } from "expo-router";
import { errorMessage } from "@/core/domain/errors";
import { formatNumber } from "@/shared/format";
import { Banner, Button, commonStyles } from "@/shared/ui";
import type { AssessmentGrades, AssessmentHeader } from "../../../domain/models";
import { canLaunchGrades } from "../../../domain/rules";
import { GRADES_LOCKED_MESSAGE } from "../../../domain/usecases";
import type { GradesFormState } from "../../hooks/useGradesForm";
import { toGradeEntries, useGradesForm } from "../../hooks/useGradesForm";
import { useSaveGrades } from "../../hooks/useSaveGrades";
import { ASSESSMENT_STATUS_LABELS } from "../../labels";
import { GradeRow } from "../GradeRow";
import { styles } from "./styles";

type StudentItem = GradesFormState["students"][number];

interface GradesFormProps {
  assessmentId: string;
  header: AssessmentHeader;
  grades: AssessmentGrades;
}

const keyExtractor = (item: StudentItem) => item.studentId;
const Separator = () => <View style={commonStyles.separator} />;

export function GradesForm({ assessmentId, header, grades }: GradesFormProps) {
  const editable = canLaunchGrades(header.status);
  const { state, setScore } = useGradesForm(grades);
  const { mutate, isPending, error } = useSaveGrades();

  const renderItem: ListRenderItem<StudentItem> = useCallback(
    ({ item }) => (
      <GradeRow
        studentId={item.studentId}
        fullName={item.fullName}
        registration={item.registration}
        score={state.scores[item.studentId] ?? ""}
        editable={editable}
        onChange={setScore}
      />
    ),
    [state.scores, editable, setScore]
  );

  const save = () =>
    mutate(
      { assessmentId, status: header.status, maxScore: header.maxScore, entries: toGradeEntries(state) },
      { onSuccess: () => router.back() }
    );

  return (
    <FlatList
      style={commonStyles.screen}
      contentContainerStyle={commonStyles.content}
      keyboardShouldPersistTaps="handled"
      data={state.students}
      extraData={state.scores}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      initialNumToRender={12}
      windowSize={7}
      ListHeaderComponent={
        <View style={styles.header}>
          <Stack.Screen options={{ title: header.title }} />
          <Text style={commonStyles.subtitle}>
            Nota máxima {formatNumber(header.maxScore)} · {ASSESSMENT_STATUS_LABELS[header.status].label}
          </Text>
          {editable ? null : <Banner tone="info" message={GRADES_LOCKED_MESSAGE} />}
        </View>
      }
      ListFooterComponent={
        <View style={styles.footer}>
          {error ? <Banner message={errorMessage(error, "Não foi possível salvar as notas")} /> : null}
          {editable ? <Button title="Salvar notas" onPress={save} loading={isPending} /> : null}
        </View>
      }
    />
  );
}
