import { useCallback } from "react";
import { FlatList, Text, View } from "react-native";
import type { ListRenderItem } from "react-native";
import { router, Stack } from "expo-router";
import { errorMessage } from "@/core/domain/errors";
import { formatDate } from "@/shared/format";
import { Banner, Button, commonStyles } from "@/shared/ui";
import type { AttendanceDraft } from "../../../domain/models";
import type { AttendanceFormState } from "../../hooks/useAttendanceForm";
import { toAttendanceDraft, useAttendanceForm } from "../../hooks/useAttendanceForm";
import { useSaveAttendance } from "../../hooks/useSaveAttendance";
import { ATTENDANCE_LABELS } from "../../labels";
import { AttendanceDetailsCard } from "../AttendanceDetailsCard";
import { AttendanceRow } from "../AttendanceRow";
import { styles } from "./styles";

type StudentItem = AttendanceFormState["students"][number];

interface AttendanceFormProps {
  initial: AttendanceDraft;
  classId: string;
  className: string;
  discipline: string;
  teacherId?: string;
  lessonId?: string;
}

const keyExtractor = (item: StudentItem) => item.studentId;
const Separator = () => <View style={commonStyles.separator} />;

export function AttendanceForm({ initial, classId, className, discipline, teacherId, lessonId }: AttendanceFormProps) {
  const { state, counts, setDate, setLessonCount, setTopic, setStatus } = useAttendanceForm(initial);
  const { mutate, isPending, error } = useSaveAttendance();

  const renderItem: ListRenderItem<StudentItem> = useCallback(
    ({ item }) => (
      <AttendanceRow
        studentId={item.studentId}
        fullName={item.fullName}
        status={state.statuses[item.studentId]}
        onChange={setStatus}
      />
    ),
    [state.statuses, setStatus]
  );

  const save = () =>
    mutate(
      { classId, disciplineName: discipline, teacherId, lessonId, draft: toAttendanceDraft(state) },
      { onSuccess: () => router.back() }
    );

  return (
    <FlatList
      style={commonStyles.screen}
      contentContainerStyle={commonStyles.content}
      keyboardShouldPersistTaps="handled"
      data={state.students}
      extraData={state.statuses}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      initialNumToRender={12}
      windowSize={7}
      ListHeaderComponent={
        <View style={styles.header}>
          <Stack.Screen
            options={{ title: lessonId ? `Chamada de ${formatDate(initial.date)}` : `Nova chamada · ${className}` }}
          />
          <Text style={commonStyles.subtitle}>{discipline}</Text>
          <AttendanceDetailsCard
            date={state.date}
            lessonCount={state.lessonCount}
            topic={state.topic}
            onChangeDate={setDate}
            onChangeLessonCount={setLessonCount}
            onChangeTopic={setTopic}
          />
          <View style={commonStyles.spaceBetween}>
            <Text style={commonStyles.sectionTitle}>Alunos ({state.students.length})</Text>
            <Text style={commonStyles.muted}>
              {counts.PRESENT} {ATTENDANCE_LABELS.PRESENT.short} · {counts.ABSENT} {ATTENDANCE_LABELS.ABSENT.short} ·{" "}
              {counts.JUSTIFIED} {ATTENDANCE_LABELS.JUSTIFIED.short}
            </Text>
          </View>
        </View>
      }
      ListFooterComponent={
        <View style={styles.footer}>
          {error ? <Banner message={errorMessage(error, "Não foi possível salvar a chamada")} /> : null}
          <Button title={lessonId ? "Salvar alterações" : "Registrar chamada"} onPress={save} loading={isPending} />
        </View>
      }
    />
  );
}
