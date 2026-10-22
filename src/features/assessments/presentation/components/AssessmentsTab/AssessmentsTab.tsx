import { useCallback } from "react";
import { RefreshControl, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import type { ListRenderItem } from "@shopify/flash-list";
import { useCurrentTeacherId } from "@/features/auth";
import type { ClassRouteParams } from "@/shared/navigation";
import { routes } from "@/shared/navigation";
import { Button, commonStyles, ListState } from "@/shared/ui";
import type { Assessment } from "../../../domain/models";
import { useClassAssessments } from "../../hooks/useClassAssessments";
import { AssessmentCard } from "../AssessmentCard";
import { styles } from "./styles";

const keyExtractor = (item: Assessment) => item.id;
const Separator = () => <View style={commonStyles.separator} />;

export function AssessmentsTab({ classId, discipline, className }: ClassRouteParams) {
  const teacherId = useCurrentTeacherId();
  const { data, error, isPending, isRefetching, refetch } = useClassAssessments(classId, discipline, teacherId);

  const openGrades = useCallback(
    (assessment: Assessment) =>
      router.push(
        routes.grades({
          assessmentId: assessment.id,
          classId,
          title: assessment.title,
          maxScore: String(assessment.maxScore),
          status: assessment.status,
        })
      ),
    [classId]
  );

  const renderItem: ListRenderItem<Assessment> = useCallback(
    ({ item }) => <AssessmentCard assessment={item} onPress={openGrades} />,
    [openGrades]
  );

  return (
    <FlashList
      contentContainerStyle={commonStyles.content}
      data={data ?? []}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Button
            title="Nova avaliação"
            onPress={() => router.push(routes.newAssessment({ classId, discipline, className }))}
          />
        </View>
      }
      ListEmptyComponent={
        <ListState
          isPending={isPending}
          error={error}
          isEmpty={!data?.length}
          emptyMessage="Nenhuma avaliação nesta disciplina."
          onRetry={() => void refetch()}
        />
      }
    />
  );
}
