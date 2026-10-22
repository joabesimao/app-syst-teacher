import { useState } from "react";
import { View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { AssessmentsTab } from "@/features/assessments";
import { LessonsTab } from "@/features/lessons";
import { StudentsTab } from "@/features/students";
import { requireParams } from "@/shared/navigation";
import type { Segment } from "@/shared/ui";
import { commonStyles, EmptyState, SegmentedControl } from "@/shared/ui";
import { styles } from "./styles";

type Tab = "chamadas" | "avaliacoes" | "alunos";

const TABS: Segment<Tab>[] = [
  { key: "chamadas", label: "Chamadas" },
  { key: "avaliacoes", label: "Avaliações" },
  { key: "alunos", label: "Alunos" },
];

export function ClassScreen() {
  const params = requireParams(useLocalSearchParams(), ["classId", "discipline", "className"] as const);
  const [tab, setTab] = useState<Tab>("chamadas");

  if (!params) return <EmptyState message="Turma não encontrada." />;

  return (
    <View style={commonStyles.screen}>
      <Stack.Screen options={{ title: `${params.className} · ${params.discipline}` }} />
      <SegmentedControl segments={TABS} value={tab} onChange={setTab} style={styles.tabs} />
      {tab === "chamadas" ? <LessonsTab {...params} /> : null}
      {tab === "avaliacoes" ? <AssessmentsTab classId={params.classId} discipline={params.discipline} /> : null}
      {tab === "alunos" ? <StudentsTab classId={params.classId} /> : null}
    </View>
  );
}
