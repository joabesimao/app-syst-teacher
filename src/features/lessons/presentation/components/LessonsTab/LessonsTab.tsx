import { useCallback, useMemo } from "react";
import { RefreshControl, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import type { ListRenderItem } from "@shopify/flash-list";
import { useCurrentTeacherId } from "@/features/auth";
import type { ClassRouteParams } from "@/shared/navigation";
import { routes } from "@/shared/navigation";
import { Button, commonStyles, ListState, Loading } from "@/shared/ui";
import type { Lesson } from "../../../domain/models";
import { useLessons } from "../../hooks/useLessons";
import { LessonCard } from "../LessonCard";
import { styles } from "./styles";

const keyExtractor = (item: Lesson) => item.id;
const Separator = () => <View style={commonStyles.separator} />;

export function LessonsTab({ classId, discipline, className }: ClassRouteParams) {
  const teacherId = useCurrentTeacherId();
  const filters = useMemo(() => ({ classId, disciplineName: discipline, teacherId }), [classId, discipline, teacherId]);
  const { data, error, isPending, isRefetching, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useLessons(filters);

  const openLesson = useCallback(
    (lesson: Lesson) => router.push(routes.attendance({ classId, discipline, className, lessonId: lesson.id })),
    [classId, discipline, className]
  );

  const renderItem: ListRenderItem<Lesson> = useCallback(
    ({ item }) => <LessonCard lesson={item} onPress={openLesson} />,
    [openLesson]
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <FlashList
      contentContainerStyle={commonStyles.content}
      data={data ?? []}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Button title="Nova chamada" onPress={() => router.push(routes.attendance({ classId, discipline, className }))} />
        </View>
      }
      ListEmptyComponent={
        <ListState
          isPending={isPending}
          error={error}
          isEmpty={!data?.length}
          emptyMessage="Nenhuma chamada registrada."
          onRetry={() => void refetch()}
        />
      }
      ListFooterComponent={isFetchingNextPage ? <Loading inline /> : null}
    />
  );
}
