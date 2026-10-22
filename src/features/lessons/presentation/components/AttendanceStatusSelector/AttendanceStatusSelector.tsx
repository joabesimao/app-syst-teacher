import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { tones } from "@/shared/theme";
import type { AttendanceStatus } from "../../../domain/models";
import { ATTENDANCE_STATUSES } from "../../../domain/rules";
import { ATTENDANCE_LABELS } from "../../labels";
import { styles } from "./styles";

interface AttendanceStatusSelectorProps {
  studentName: string;
  value: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
}

export const AttendanceStatusSelector = memo(function AttendanceStatusSelector({
  studentName,
  value,
  onChange,
}: AttendanceStatusSelectorProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {ATTENDANCE_STATUSES.map((status) => {
        const selected = value === status;
        const { label, tone } = ATTENDANCE_LABELS[status];
        const palette = tones[tone];
        return (
          <Pressable
            key={status}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${studentName}: ${label}`}
            onPress={() => onChange(status)}
            style={[
              styles.option,
              selected && { borderColor: palette.color, backgroundColor: palette.background },
            ]}
          >
            <Text style={[styles.label, selected && { color: palette.color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});
