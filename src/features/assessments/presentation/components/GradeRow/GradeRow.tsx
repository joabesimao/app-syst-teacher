import { memo, useCallback } from "react";
import { Text, TextInput, View } from "react-native";
import { colors } from "@/shared/theme";
import { Card, commonStyles } from "@/shared/ui";
import { styles } from "./styles";

interface GradeRowProps {
  studentId: string;
  fullName: string;
  registration: string;
  score: string;
  editable: boolean;
  onChange: (studentId: string, value: string) => void;
}

export const GradeRow = memo(function GradeRow({
  studentId,
  fullName,
  registration,
  score,
  editable,
  onChange,
}: GradeRowProps) {
  const handleChange = useCallback((value: string) => onChange(studentId, value), [onChange, studentId]);
  return (
    <Card style={styles.card}>
      <View style={styles.info}>
        <Text style={commonStyles.text}>{fullName}</Text>
        <Text style={commonStyles.muted}>Matrícula {registration}</Text>
      </View>
      <TextInput
        accessibilityLabel={`Nota de ${fullName}`}
        value={score}
        onChangeText={handleChange}
        editable={editable}
        keyboardType="decimal-pad"
        placeholder="—"
        placeholderTextColor={colors.muted}
        maxLength={6}
        style={[styles.input, !editable && styles.disabled]}
      />
    </Card>
  );
});
