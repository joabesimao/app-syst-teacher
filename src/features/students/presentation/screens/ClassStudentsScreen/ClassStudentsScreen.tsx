import { View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { requireParams } from "@/shared/navigation";
import { commonStyles, EmptyState } from "@/shared/ui";
import { StudentsTab } from "../../components/StudentsTab";

export function ClassStudentsScreen() {
  const params = requireParams(useLocalSearchParams(), ["classId", "className"] as const);

  if (!params) return <EmptyState message="Turma não encontrada." />;

  return (
    <View style={commonStyles.screen}>
      <Stack.Screen options={{ title: `Alunos · ${params.className}` }} />
      <StudentsTab {...params} />
    </View>
  );
}
