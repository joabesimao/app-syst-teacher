import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import type { ListRenderItem } from "react-native";
import { useCurrentUser } from "@/features/auth";
import { commonStyles, Loading } from "@/shared/ui";
import { DashboardHeader } from "../../components/DashboardHeader";
import { FiltersModal } from "../../components/FiltersModal";
import { DASHBOARD_SECTIONS } from "../../components/sections";
import { useTeacherDashboard } from "../../hooks/useTeacherDashboard";
import { useDashboardFilters } from "../../store/useDashboardFilters";

type SectionItem = (typeof DASHBOARD_SECTIONS)[number];

const keyExtractor = (item: SectionItem) => item.key;
const Separator = () => <View style={commonStyles.separator} />;

export function DashboardScreen() {
  const user = useCurrentUser();
  const filters = useDashboardFilters((state) => state.filters);
  const setFilters = useDashboardFilters((state) => state.setFilters);
  const { data, error, isPending, isRefetching, refetch } = useTeacherDashboard();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const renderItem: ListRenderItem<SectionItem> = useCallback(
    ({ item: { Component } }) => (data ? <Component data={data} filters={filters} /> : null),
    [data, filters]
  );

  if (isPending) return <Loading />;

  return (
    <>
      <FlatList
        style={commonStyles.screen}
        contentContainerStyle={commonStyles.content}
        data={data ? DASHBOARD_SECTIONS : []}
        extraData={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        initialNumToRender={3}
        maxToRenderPerBatch={2}
        windowSize={5}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
        ListHeaderComponent={
          <DashboardHeader
            userName={user?.name}
            data={data}
            filters={filters}
            error={error}
            onOpenFilters={() => setFiltersOpen(true)}
            onRetry={() => void refetch()}
          />
        }
      />
      {data ? (
        <FiltersModal
          visible={filtersOpen}
          initial={{ ...filters, schoolYear: data.schoolYear, term: data.term }}
          classes={data.classes}
          onApply={setFilters}
          onClose={() => setFiltersOpen(false)}
        />
      ) : null}
    </>
  );
}
