import { memo, useMemo, useState } from "react";
import { Text } from "react-native";
import { formatNumber, formatSigned } from "@/shared/format";
import { colors } from "@/shared/theme";
import type { ChipOption } from "@/shared/ui";
import { ChipGroup, commonStyles, Section } from "@/shared/ui";
import type { RankingMode } from "../../../domain/rules";
import { isEvolutionMode, rankingEntries } from "../../../domain/rules";
import { scoreColor } from "../../colors";
import { openStudent } from "../../navigation";
import type { RankingRow } from "../lists";
import { RankingList } from "../lists";
import type { SectionProps } from "./types";

const MODES: ChipOption<RankingMode>[] = [
  { value: "best", label: "Melhores" },
  { value: "worst", label: "Atenção" },
  { value: "risers", label: "Subiram" },
  { value: "fallers", label: "Caíram" },
];

export const RankingSection = memo(function RankingSection({ data }: SectionProps) {
  const [mode, setMode] = useState<RankingMode>("best");

  const rows = useMemo<RankingRow[]>(
    () =>
      rankingEntries(data, mode).map((entry) => ({
        key: entry.key,
        primary: entry.fullName,
        secondary: entry.change
          ? `${entry.className} · ${formatNumber(entry.change.previous)} → ${formatNumber(entry.change.current)}`
          : entry.className,
        value: entry.change ? formatSigned(entry.value) : formatNumber(entry.value),
        color: entry.change ? (entry.value > 0 ? colors.success : colors.danger) : scoreColor(entry.value),
        onPress: () => openStudent(entry),
      })),
    [data, mode]
  );

  return (
    <Section title="Desempenho dos alunos" subtitle="Média geral no bimestre">
      <ChipGroup value={mode} onChange={setMode} options={MODES} />
      {rows.length ? (
        <RankingList rows={rows} />
      ) : (
        <Text style={commonStyles.muted}>
          {data.term === 1 && isEvolutionMode(mode)
            ? "Disponível a partir do 2º bimestre."
            : "Sem dados para os filtros selecionados."}
        </Text>
      )}
    </Section>
  );
});
