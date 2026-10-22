import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { errorMessage } from "@/core/domain/errors";
import { readParam } from "@/shared/navigation";
import { Banner, EmptyState, Loading } from "@/shared/ui";
import { GradesForm } from "../../components/GradesForm";
import { useAssessmentGrades } from "../../hooks/useAssessmentGrades";
import { useAssessmentHeader } from "../../hooks/useAssessmentHeader";
import { styles } from "./styles";

export function GradesScreen() {
  const params = useLocalSearchParams();
  const assessmentId = readParam(params, "assessmentId");
  const classId = readParam(params, "classId");
  const header = useAssessmentHeader(assessmentId, {
    title: readParam(params, "title"),
    maxScore: readParam(params, "maxScore"),
    status: readParam(params, "status"),
  });
  const { data, error, isPending, refetch } = useAssessmentGrades(assessmentId, classId);

  if (!assessmentId || !classId || !header) return <EmptyState message="Avaliação não encontrada." />;
  if (isPending) return <Loading />;
  if (!data) {
    return (
      <View style={styles.container}>
        <Banner message={errorMessage(error, "Não foi possível carregar as notas")} onAction={() => void refetch()} />
      </View>
    );
  }

  return <GradesForm assessmentId={assessmentId} header={header} grades={data} />;
}
