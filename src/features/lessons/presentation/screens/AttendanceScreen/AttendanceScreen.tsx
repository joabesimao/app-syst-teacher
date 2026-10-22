import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { errorMessage } from "@/core/domain/errors";
import { useCurrentTeacherId } from "@/features/auth";
import { readParam, requireParams } from "@/shared/navigation";
import { Banner, EmptyState, Loading } from "@/shared/ui";
import { AttendanceForm } from "../../components/AttendanceForm";
import { useAttendanceDraft } from "../../hooks/useAttendanceDraft";
import { styles } from "./styles";

export function AttendanceScreen() {
  const rawParams = useLocalSearchParams();
  const params = requireParams(rawParams, ["classId", "discipline", "className"] as const);
  const lessonId = readParam(rawParams, "lessonId");
  const teacherId = useCurrentTeacherId();
  const { data, error, isPending, refetch } = useAttendanceDraft(params?.classId, lessonId);

  if (!params) return <EmptyState message="Turma não encontrada." />;
  if (isPending) return <Loading />;
  if (!data) {
    return (
      <View style={styles.container}>
        <Banner message={errorMessage(error, "Não foi possível carregar a chamada")} onAction={() => void refetch()} />
      </View>
    );
  }

  return <AttendanceForm initial={data} teacherId={teacherId} lessonId={lessonId} {...params} />;
}
