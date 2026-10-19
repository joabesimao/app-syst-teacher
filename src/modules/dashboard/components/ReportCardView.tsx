import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChipGroup } from "../../../components/ChipGroup";
import { colors, spacing } from "../../../theme";
import { formatNumber } from "../../../utils/labels";
import { classYear, scoreColor, studentYear, TERM_LABELS } from "../selectors";
import type { ReportCard, ReportCardStudent, TermSeries } from "../types";
import { OVERALL } from "../types";

interface ReportCardViewProps {
  reportCards: ReportCard[];
  disciplineName?: string;
  onSelectStudent: (card: ReportCard, student: ReportCardStudent) => void;
}

function ScoreRow({ terms, annual, bold }: { terms: TermSeries; annual: number | null; bold?: boolean }) {
  return (
    <View style={cardStyles.scores}>
      {terms.map((value, index) => (
        <Text key={index} style={[cardStyles.score, { color: scoreColor(value) }, bold && cardStyles.bold]}>
          {formatNumber(value)}
        </Text>
      ))}
      <Text style={[cardStyles.score, cardStyles.annual, { color: scoreColor(annual) }]}>{formatNumber(annual)}</Text>
    </View>
  );
}

export function ReportCardView({ reportCards, disciplineName, onSelectStudent }: ReportCardViewProps) {
  const [classId, setClassId] = useState<string>();
  const [chosenDiscipline, setChosenDiscipline] = useState(OVERALL);
  const card = reportCards.find((item) => item.classId === classId) ?? reportCards[0];
  if (!card) return null;

  const discipline =
    disciplineName ?? (card.disciplines.includes(chosenDiscipline) ? chosenDiscipline : OVERALL);
  const average = classYear(card, discipline);

  return (
    <View style={cardStyles.container}>
      {reportCards.length > 1 ? (
        <ChipGroup
          value={card.classId}
          onChange={setClassId}
          options={reportCards.map((item) => ({ value: item.classId, label: item.className }))}
        />
      ) : null}
      {!disciplineName && card.disciplines.length > 1 ? (
        <ChipGroup
          value={discipline}
          onChange={setChosenDiscipline}
          options={[
            { value: OVERALL, label: "Geral" },
            ...card.disciplines.map((item) => ({ value: item, label: item })),
          ]}
        />
      ) : null}

      <View style={cardStyles.header}>
        <Text style={[cardStyles.name, cardStyles.headerText]}>Aluno</Text>
        <View style={cardStyles.scores}>
          {TERM_LABELS.map((label) => (
            <Text key={label} style={[cardStyles.score, cardStyles.headerText]}>
              {label}
            </Text>
          ))}
          <Text style={[cardStyles.score, cardStyles.annual, cardStyles.headerText]}>Anual</Text>
        </View>
      </View>

      {card.students.map((student) => {
        const year = studentYear(student, discipline);
        return (
          <Pressable
            key={student.studentId}
            accessibilityRole="button"
            onPress={() => onSelectStudent(card, student)}
            style={({ pressed }) => [cardStyles.row, pressed && cardStyles.pressed]}
          >
            <Text style={cardStyles.name} numberOfLines={1}>
              {student.fullName}
              {student.transferred ? <Text style={cardStyles.transferred}> · transf.</Text> : null}
            </Text>
            <ScoreRow terms={year.terms} annual={year.annual} />
          </Pressable>
        );
      })}

      <View style={[cardStyles.row, cardStyles.total]}>
        <Text style={[cardStyles.name, cardStyles.bold]}>Média da turma</Text>
        <ScoreRow terms={average.terms} annual={average.annual} bold />
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  container: { gap: spacing(1) },
  header: { flexDirection: "row", alignItems: "center", paddingTop: spacing(0.5) },
  headerText: { fontSize: 11, fontWeight: "700", color: colors.muted },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing(1),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: { opacity: 0.6 },
  total: { borderBottomWidth: 0, borderTopWidth: 2, borderTopColor: colors.border },
  name: { flex: 1, fontSize: 14, color: colors.text, paddingRight: spacing(1) },
  transferred: { fontSize: 11, color: colors.warning },
  scores: { flexDirection: "row" },
  score: { width: 34, textAlign: "right", fontSize: 13, fontWeight: "500" },
  annual: { width: 42 },
  bold: { fontWeight: "700" },
});
