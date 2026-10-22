import { memo } from "react";
import { Text } from "react-native";
import { Card, commonStyles } from "@/shared/ui";
import type { Student } from "../../../domain/models";

export const StudentCard = memo(function StudentCard({ student }: { student: Student }) {
  return (
    <Card>
      <Text style={commonStyles.text}>{student.fullName}</Text>
      <Text style={commonStyles.muted}>
        Matrícula {student.registration}
        {student.isActive ? "" : " · Inativo"}
      </Text>
    </Card>
  );
});
