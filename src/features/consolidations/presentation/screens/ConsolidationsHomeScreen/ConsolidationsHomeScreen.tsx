import { useState } from "react";
import { View } from "react-native";
import type { Segment } from "@/shared/ui";
import { commonStyles, SegmentedControl } from "@/shared/ui";
import { ConsolidationList } from "../../components/ConsolidationsTab";
import { TemplatesList } from "../../components/TemplatesList";
import { styles } from "./styles";

type Tab = "aplicacoes" | "modelos";

const TABS: Segment<Tab>[] = [
  { key: "aplicacoes", label: "Aplicações" },
  { key: "modelos", label: "Modelos" },
];

export function ConsolidationsHomeScreen() {
  const [tab, setTab] = useState<Tab>("aplicacoes");
  return (
    <View style={commonStyles.screen}>
      <SegmentedControl segments={TABS} value={tab} onChange={setTab} style={styles.tabs} />
      {tab === "aplicacoes" ? (
        <ConsolidationList emptyMessage="Nenhuma consolidação aplicada. Abra uma turma para aplicar um modelo." />
      ) : (
        <TemplatesList />
      )}
    </View>
  );
}
