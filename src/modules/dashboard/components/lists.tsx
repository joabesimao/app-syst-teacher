import { Pressable, StyleSheet, Text, View } from "react-native";
import { AssessmentStatusChip } from "../../../components/StatusChip";
import { colors, spacing } from "../../../theme";
import { formatDate, formatNumber } from "../../../utils/labels";
import { scoreColor } from "../selectors";
import type { AssessmentSummary, StudentAbsence } from "../types";

export interface RankingRow {
  key: string;
  primary: string;
  secondary: string;
  value: string;
  color: string;
  onPress?: () => void;
}

export function RankingList({ rows }: { rows: RankingRow[] }) {
  return (
    <View>
      {rows.map((row, index) => (
        <Pressable
          key={row.key}
          accessibilityRole="button"
          onPress={row.onPress}
          style={({ pressed }) => [listStyles.row, pressed && listStyles.pressed]}
        >
          <Text style={listStyles.position}>{index + 1}</Text>
          <View style={listStyles.grow}>
            <Text style={listStyles.primary} numberOfLines={1}>
              {row.primary}
            </Text>
            <Text style={listStyles.secondary}>{row.secondary}</Text>
          </View>
          <Text style={[listStyles.value, { color: row.color }]}>{row.value}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function AbsenceList({
  students,
  onPress,
}: {
  students: StudentAbsence[];
  onPress: (student: StudentAbsence) => void;
}) {
  return (
    <View>
      {students.map((student) => (
        <Pressable
          key={`${student.classId}:${student.studentId}`}
          accessibilityRole="button"
          onPress={() => onPress(student)}
          style={({ pressed }) => [listStyles.row, pressed && listStyles.pressed]}
        >
          <View style={listStyles.grow}>
            <Text style={listStyles.primary} numberOfLines={1}>
              {student.fullName}
            </Text>
            <Text style={listStyles.secondary}>
              {student.className} · {student.absences} falta(s) · {student.justified} justificada(s)
            </Text>
          </View>
          <Text style={[listStyles.value, { color: student.belowMinimum ? colors.danger : colors.text }]}>
            {formatNumber(student.attendancePercent, "%")}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function AssessmentRows({
  assessments,
  onPress,
}: {
  assessments: AssessmentSummary[];
  onPress: (assessment: AssessmentSummary) => void;
}) {
  return (
    <View>
      {assessments.map((assessment) => {
        return (
          <Pressable
            key={assessment.id}
            accessibilityRole="button"
            onPress={() => onPress(assessment)}
            style={({ pressed }) => [listStyles.row, pressed && listStyles.pressed]}
          >
            <View style={listStyles.grow}>
              <Text style={listStyles.primary} numberOfLines={1}>
                {assessment.title}
              </Text>
              <Text style={listStyles.secondary}>
                {assessment.className} · {assessment.disciplineName} · {formatDate(assessment.dueDate)}
              </Text>
              <AssessmentStatusChip status={assessment.status} />
            </View>
            <View style={listStyles.right}>
              <Text style={[listStyles.value, { color: scoreColor(assessment.average) }]}>
                {formatNumber(assessment.average)}
              </Text>
              <Text style={listStyles.secondary}>
                {formatNumber(assessment.lowest?.normalizedScore)}–{formatNumber(assessment.highest?.normalizedScore)}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export const listStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(1.5),
    paddingVertical: spacing(1),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: { opacity: 0.6 },
  position: { width: 22, textAlign: "center", fontWeight: "700", color: colors.muted },
  grow: { flex: 1, gap: 2 },
  right: { alignItems: "flex-end", gap: 2 },
  primary: { fontSize: 15, fontWeight: "600", color: colors.text },
  secondary: { fontSize: 12, color: colors.muted },
  value: { fontSize: 16, fontWeight: "700" },
});
