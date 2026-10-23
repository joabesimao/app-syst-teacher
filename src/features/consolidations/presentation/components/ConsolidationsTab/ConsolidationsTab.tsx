import { useCallback } from "react";
import { RefreshControl, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import type { ListRenderItem } from "@shopify/flash-list";
import type { ClassRouteParams } from "@/shared/navigation";
import { routes } from "@/shared/navigation";
import { Button, commonStyles, ListState } from "@/shared/ui";
import type { Consolidation } from "../../../domain/models";
import { useConsolidations } from "../../hooks/useConsolidations";
import { ConsolidationCard } from "../ConsolidationCard";
import { styles } from "./styles";

const keyExtractor = (item: Consolidation) => item.id;
const Separator = () => <View style={commonStyles.separator} />;
const openSheet = (consolidation: Consolidation) =>
  router.push(routes.consolidation({ consolidationId: consolidation.id }));

interface ConsolidationListProps {
  classId?: string;
  discipline?: string;
  header?: React.ReactElement;
  emptyMessage: string;
}

export function ConsolidationList({ classId, discipline, header, emptyMessage }: ConsolidationListProps) {
  const { data, error, isPending, isRefetching, refetch } = useConsolidations(classId, discipline);

  const renderItem: ListRenderItem<Consolidation> = useCallback(
    ({ item }) => <ConsolidationCard consolidation={item} showClass={!classId} onPress={openSheet} />,
    [classId]
  );

  return (
    <FlashList
      contentContainerStyle={commonStyles.content}
      data={data ?? []}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <ListState
          isPending={isPending}
          error={error}
          isEmpty={!data?.length}
          emptyMessage={emptyMessage}
          onRetry={() => void refetch()}
        />
      }
    />
  );
}

export function ConsolidationsTab({ classId, discipline, className }: ClassRouteParams) {
  return (
    <ConsolidationList
      classId={classId}
      discipline={discipline}
      emptyMessage="Nenhuma consolidação nesta disciplina."
      header={
        <View style={styles.header}>
          <Button
            title="Nova consolidação"
            onPress={() => router.push(routes.newConsolidation({ classId, discipline, className }))}
          />
        </View>
      }
    />
  );
}
