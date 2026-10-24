import { useCallback } from "react";
import { Alert, RefreshControl, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import type { ListRenderItem } from "@shopify/flash-list";
import { errorMessage } from "@/core/domain/errors";
import { useCurrentTeacherId } from "@/features/auth";
import { routes } from "@/shared/navigation";
import { Banner, Button, commonStyles, ListState } from "@/shared/ui";
import type { ConsolidationTemplate } from "../../../domain/models";
import { useDeleteTemplate, useDuplicateTemplate } from "../../hooks/useConsolidationMutations";
import { useConsolidationTemplates } from "../../hooks/useConsolidationTemplates";
import { TemplateCard } from "../TemplateCard";
import { styles } from "./styles";

const keyExtractor = (item: ConsolidationTemplate) => item.id;
const Separator = () => <View style={commonStyles.separator} />;

export function TemplatesList() {
  const teacherId = useCurrentTeacherId();
  const { data, error, isPending, isRefetching, refetch } = useConsolidationTemplates();
  const duplicate = useDuplicateTemplate();
  const removal = useDeleteTemplate();
  const busy = duplicate.isPending || removal.isPending;

  const onDuplicate = useCallback((template: ConsolidationTemplate) => duplicate.mutate(template.id), [duplicate]);
  const onDelete = useCallback(
    (template: ConsolidationTemplate) =>
      Alert.alert("Excluir modelo", `Excluir "${template.name}"?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => removal.mutate(template.id) },
      ]),
    [removal]
  );

  const renderItem: ListRenderItem<ConsolidationTemplate> = useCallback(
    ({ item }) => (
      <TemplateCard
        template={item}
        mine={!!teacherId && item.ownerTeacherId === teacherId}
        busy={busy}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    ),
    [teacherId, busy, onDuplicate, onDelete]
  );

  const actionError = duplicate.error ?? removal.error;

  return (
    <FlashList
      contentContainerStyle={commonStyles.content}
      data={data ?? []}
      extraData={busy}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Button title="Novo modelo" onPress={() => router.push(routes.newConsolidationTemplate())} />
          {actionError ? <Banner message={errorMessage(actionError, "Não foi possível concluir a ação")} /> : null}
          {duplicate.isSuccess ? <Banner tone="success" message="Modelo duplicado. A cópia é sua." /> : null}
        </View>
      }
      ListEmptyComponent={
        <ListState
          isPending={isPending}
          error={error}
          isEmpty={!data?.length}
          emptyMessage="Nenhum modelo disponível."
          onRetry={() => void refetch()}
        />
      }
    />
  );
}
