import { useState } from "react";
import { View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { AssessmentsTab } from "@/features/assessments";
import { ConsolidationsTab } from "@/features/consolidations";
import { LessonsTab } from "@/features/lessons";
import { StudentsTab } from "@/features/students";
import { requireParams } from "@/shared/navigation";
import type { Segment } from "@/shared/ui";
import { commonStyles, EmptyState, SegmentedControl } from "@/shared/ui";
import { styles } from "./styles";

type Tab = "chamadas" | "avaliacoes" | "consolidacoes" | "alunos";

const TABS: Segment<Tab>[] = [
  { key: "chamadas", label: "Chamadas" },
  { key: "avaliacoes", label: "Avaliações" },
  { key: "consolidacoes", label: "Consolidações" },
  { key: "alunos", label: "Alunos" },
];

export function ClassScreen() {
  const params = requireParams(useLocalSearchParams(), ["classId", "discipline", "className"] as const);
  const [tab, setTab] = useState<Tab>("chamadas");

  if (!params) return <EmptyState message="Turma não encontrada." />;

  return (
    <View style={commonStyles.screen}>
      <Stack.Screen options={{ title: `${params.className} · ${params.discipline}` }} />
      <SegmentedControl segments={TABS} value={tab} onChange={setTab} style={styles.tabs} scrollable />
      {tab === "chamadas" ? <LessonsTab {...params} /> : null}
      {tab === "avaliacoes" ? <AssessmentsTab {...params} /> : null}
      {tab === "consolidacoes" ? <ConsolidationsTab {...params} /> : null}
      {tab === "alunos" ? <StudentsTab classId={params.classId} /> : null}
    </View>
  );
}
