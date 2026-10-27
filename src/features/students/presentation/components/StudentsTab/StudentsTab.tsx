import { useCallback } from "react";
import { RefreshControl, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import type { ListRenderItem } from "@shopify/flash-list";
import type { ClassStudentsRouteParams } from "@/shared/navigation";
import { routes } from "@/shared/navigation";
import { Button, commonStyles, ListState, Loading } from "@/shared/ui";
import type { Student } from "../../../domain/models";
import { useClassStudents } from "../../hooks/useClassStudents";
import { StudentCard } from "../StudentCard";
import { styles } from "./styles";

const renderItem: ListRenderItem<Student> = ({ item }) => <StudentCard student={item} />;
const keyExtractor = (item: Student) => item.id;
const Separator = () => <View style={commonStyles.separator} />;

export function StudentsTab({ classId, className }: ClassStudentsRouteParams) {
  const { data, error, isPending, isRefetching, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useClassStudents(classId);

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
          <Button title="Novo aluno" onPress={() => router.push(routes.newStudent({ classId, className }))} />
        </View>
      }
      ListEmptyComponent={
        <ListState
          isPending={isPending}
          error={error}
          isEmpty={!data?.length}
          emptyMessage="Nenhum aluno nesta turma."
          onRetry={() => void refetch()}
        />
      }
      ListFooterComponent={isFetchingNextPage ? <Loading inline /> : null}
    />
  );
}
