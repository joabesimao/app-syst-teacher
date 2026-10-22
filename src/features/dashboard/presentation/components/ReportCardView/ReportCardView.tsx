import { memo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ChipGroup } from "@/shared/ui";
import { OVERALL } from "../../../domain/constants";
import type { ReportCard, ReportCardStudent } from "../../../domain/models";
import { classYear, studentYear } from "../../../domain/rules";
import { TERM_LABELS } from "../../labels";
import { ScoreRow } from "./ScoreRow";
import { styles } from "./styles";

interface ReportCardViewProps {
  reportCards: ReportCard[];
  disciplineName?: string;
  onSelectStudent: (card: ReportCard, student: ReportCardStudent) => void;
}

export const ReportCardView = memo(function ReportCardView({
  reportCards,
  disciplineName,
  onSelectStudent,
}: ReportCardViewProps) {
  const [classId, setClassId] = useState<string>();
  const [chosenDiscipline, setChosenDiscipline] = useState(OVERALL);
  const card = reportCards.find((item) => item.classId === classId) ?? reportCards[0];
  if (!card) return null;

  const discipline = disciplineName ?? (card.disciplines.includes(chosenDiscipline) ? chosenDiscipline : OVERALL);
  const average = classYear(card, discipline);

  return (
    <View style={styles.container}>
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
          options={[{ value: OVERALL, label: "Geral" }, ...card.disciplines.map((item) => ({ value: item, label: item }))]}
        />
      ) : null}

      <View style={styles.header}>
        <Text style={[styles.name, styles.headerText]}>Aluno</Text>
        <View style={styles.scores}>
          {TERM_LABELS.map((label) => (
            <Text key={label} style={[styles.score, styles.headerText]}>
              {label}
            </Text>
          ))}
          <Text style={[styles.score, styles.annual, styles.headerText]}>Anual</Text>
        </View>
      </View>

      {card.students.map((student) => {
        const year = studentYear(student, discipline);
        return (
          <Pressable
            key={student.studentId}
            accessibilityRole="button"
            onPress={() => onSelectStudent(card, student)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <Text style={styles.name} numberOfLines={1}>
              {student.fullName}
              {student.transferred ? <Text style={styles.transferred}> · transf.</Text> : null}
            </Text>
            <ScoreRow terms={year.terms} annual={year.annual} />
          </Pressable>
        );
      })}

      <View style={[styles.row, styles.total]}>
        <Text style={[styles.name, styles.bold]}>Média da turma</Text>
        <ScoreRow terms={average.terms} annual={average.annual} bold />
      </View>
    </View>
  );
});
