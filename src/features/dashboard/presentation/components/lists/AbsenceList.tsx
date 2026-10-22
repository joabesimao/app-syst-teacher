import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { formatNumber } from "@/shared/format";
import { colors } from "@/shared/theme";
import type { StudentAbsence } from "../../../domain/models";
import { listStyles } from "./listStyles";

interface AbsenceListProps {
  students: StudentAbsence[];
  onPress: (student: StudentAbsence) => void;
}

export const AbsenceList = memo(function AbsenceList({ students, onPress }: AbsenceListProps) {
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
});
