import { useCallback } from "react";
import { RefreshControl, Text, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import type { ListRenderItem } from "@shopify/flash-list";
import { useCurrentUser } from "@/features/auth";
import { routes } from "@/shared/navigation";
import { Button, commonStyles, ListState } from "@/shared/ui";
import type { TeacherAssignment } from "../../../domain/models";
import { assignmentKey } from "../../../domain/rules";
import { AssignmentCard } from "../../components/AssignmentCard";
import { useMyAssignments } from "../../hooks/useMyAssignments";
import { styles } from "./styles";

const openClass = (assignment: TeacherAssignment) =>
  router.push(
    routes.classDetail({
      classId: assignment.classId,
      discipline: assignment.disciplineName,
      className: assignment.schoolClass.name,
    })
  );

const Separator = () => <View style={commonStyles.separator} />;

export function MyClassesScreen() {
  const user = useCurrentUser();
  const { data, error, isPending, isRefetching, refetch } = useMyAssignments();

  const renderItem: ListRenderItem<TeacherAssignment> = useCallback(
    ({ item }) => <AssignmentCard assignment={item} onPress={openClass} />,
    []
  );

  return (
    <FlashList
      style={commonStyles.screen}
      contentContainerStyle={commonStyles.content}
      data={data?.assignments ?? []}
      keyExtractor={assignmentKey}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={commonStyles.subtitle}>Olá, {user?.name}</Text>
          <Button title="Nova turma" onPress={() => router.push(routes.newClass())} />
        </View>
      }
      ListEmptyComponent={
        <ListState
          isPending={isPending}
          error={error}
          isEmpty
          emptyMessage={
            data && !data.linked
              ? "Seu usuário não está vinculado a um professor. Fale com a administração da escola."
              : "Você ainda não tem turmas atribuídas."
          }
          onRetry={() => void refetch()}
        />
      }
    />
  );
}
