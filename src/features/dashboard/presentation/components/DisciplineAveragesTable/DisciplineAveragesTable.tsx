import { memo } from "react";
import { Text, View } from "react-native";
import { formatNumber } from "@/shared/format";
import type { ReportCardStudent } from "../../../domain/models";
import { attendanceColor, scoreColor } from "../../colors";
import { TERM_LABELS } from "../../labels";
import { styles } from "./styles";

export const DisciplineAveragesTable = memo(function DisciplineAveragesTable({
  student,
}: {
  student: ReportCardStudent;
}) {
  return (
    <View>
      <View style={styles.row}>
        <Text style={[styles.name, styles.head]}>Disciplina</Text>
        {TERM_LABELS.map((label) => (
          <Text key={label} style={[styles.cell, styles.head]}>
            {label}
          </Text>
        ))}
        <Text style={[styles.cell, styles.annual, styles.head]}>Anual</Text>
      </View>
      {student.disciplines.map((discipline) => (
        <View key={discipline.disciplineName} style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {discipline.disciplineName}
          </Text>
          {discipline.terms.map((value, index) => (
            <Text key={index} style={[styles.cell, { color: scoreColor(value) }]}>
              {formatNumber(value)}
            </Text>
          ))}
          <Text style={[styles.cell, styles.annual, { color: scoreColor(discipline.annual) }]}>
            {formatNumber(discipline.annual)}
          </Text>
        </View>
      ))}
      <View style={styles.row}>
        <Text style={styles.name}>Frequência</Text>
        {student.attendance.map((value, index) => (
          <Text key={index} style={[styles.cell, { color: attendanceColor(value) }]}>
            {value === null ? "-" : `${Math.round(value)}%`}
          </Text>
        ))}
        <Text style={[styles.cell, styles.annual]} />
      </View>
    </View>
  );
});
