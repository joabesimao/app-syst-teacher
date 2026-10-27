import { useCallback } from "react";
import { RefreshControl, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import type { ListRenderItem } from "@shopify/flash-list";
import { routes } from "@/shared/navigation";
import { Button, commonStyles, ListState, Loading } from "@/shared/ui";
import type { SchoolClass } from "../../../domain/models";
import { SchoolClassCard } from "../../components/SchoolClassCard";
import { useSchoolClasses } from "../../hooks/useSchoolClasses";
import { styles } from "./styles";

const openClass = (schoolClass: SchoolClass) =>
  router.push(routes.classStudents({ classId: schoolClass.id, className: schoolClass.name }));

const renderItem: ListRenderItem<SchoolClass> = ({ item }) => <SchoolClassCard schoolClass={item} onPress={openClass} />;
const keyExtractor = (item: SchoolClass) => item.id;
const Separator = () => <View style={commonStyles.separator} />;

export function SchoolClassesScreen() {
  const { data, error, isPending, isRefetching, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSchoolClasses();

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <FlashList
      style={commonStyles.screen}
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
          <Button title="Nova turma" onPress={() => router.push(routes.newClass())} />
        </View>
      }
      ListEmptyComponent={
        <ListState
          isPending={isPending}
          error={error}
          isEmpty={!data?.length}
          emptyMessage="Nenhuma turma ativa cadastrada."
          onRetry={() => void refetch()}
        />
      }
      ListFooterComponent={isFetchingNextPage ? <Loading inline /> : null}
    />
  );
}
