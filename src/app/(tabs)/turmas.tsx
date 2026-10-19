import { useCallback } from "react";
import { FlatList, Pressable, RefreshControl, Text } from "react-native";
import { router } from "expo-router";
import { Banner, Card, EmptyState, Loading, styles } from "../../components/ui";
import { useAsync } from "../../hooks/useAsync";
import { loadCurrentTeacher } from "../../services/schoolApi";
import { useAuthStore } from "../../store/useAuthStore";
import { SHIFT_LABELS } from "../../utils/labels";

export default function MyClassesScreen() {
  const user = useAuthStore((state) => state.user);
  const { data, error, loading, reload } = useAsync(useCallback(() => loadCurrentTeacher(), []));

  const assignments = (data?.assignments ?? [])
    .filter((assignment) => assignment.schoolClass.isActive)
    .sort((a, b) =>
      `${a.schoolClass.name}${a.disciplineName}`.localeCompare(`${b.schoolClass.name}${b.disciplineName}`, "pt-BR")
    );

  return (
    <>
      {loading && !data ? (
        <Loading />
      ) : (
        <FlatList
          style={styles.screen}
          contentContainerStyle={styles.content}
          data={assignments}
          keyExtractor={(item) => `${item.classId}:${item.disciplineName}`}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
          ListHeaderComponent={
            <>
              <Text style={styles.subtitle}>Olá, {user?.name}</Text>
              {error ? <Banner message={error} /> : null}
            </>
          }
          ListEmptyComponent={
            error ? null : (
              <EmptyState
                message={
                  data === null
                    ? "Seu usuário não está vinculado a um professor. Fale com a administração da escola."
                    : "Você ainda não tem turmas atribuídas."
                }
              />
            )
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: "/turma",
                  params: {
                    classId: item.classId,
                    discipline: item.disciplineName,
                    className: item.schoolClass.name,
                  },
                })
              }
            >
              <Card>
                <Text style={styles.sectionTitle}>
                  {item.schoolClass.name} · {item.disciplineName}
                </Text>
                <Text style={styles.muted}>
                  {item.schoolClass.gradeLevel} · {item.schoolClass.schoolYear}
                  {item.schoolClass.shift ? ` · ${SHIFT_LABELS[item.schoolClass.shift]}` : ""}
                </Text>
              </Card>
            </Pressable>
          )}
        />
      )}
    </>
  );
}
