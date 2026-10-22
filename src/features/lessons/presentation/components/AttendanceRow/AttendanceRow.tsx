import { memo, useCallback } from "react";
import { Text } from "react-native";
import { Card, commonStyles } from "@/shared/ui";
import type { AttendanceStatus } from "../../../domain/models";
import { AttendanceStatusSelector } from "../AttendanceStatusSelector";
import { styles } from "./styles";

interface AttendanceRowProps {
  studentId: string;
  fullName: string;
  status: AttendanceStatus;
  onChange: (studentId: string, status: AttendanceStatus) => void;
}

export const AttendanceRow = memo(function AttendanceRow({ studentId, fullName, status, onChange }: AttendanceRowProps) {
  const handleChange = useCallback((next: AttendanceStatus) => onChange(studentId, next), [onChange, studentId]);
  return (
    <Card style={styles.card}>
      <Text style={commonStyles.text}>{fullName}</Text>
      <AttendanceStatusSelector studentName={fullName} value={status} onChange={handleChange} />
    </Card>
  );
});
