import { memo } from "react";
import { View } from "react-native";
import { formatNumber } from "@/shared/format";
import { colors } from "@/shared/theme";
import { StatTile } from "@/shared/ui";
import { MIN_ATTENDANCE_PERCENT } from "../../../domain/constants";
import { attendanceColor, scoreColor } from "../../colors";
import { styles } from "./styles";
import type { SectionProps } from "./types";

export const KpiTiles = memo(function KpiTiles({ data }: SectionProps) {
  const { kpis } = data;
  return (
    <View style={styles.tiles}>
      <StatTile label="Alunos" value={String(kpis.students)} />
      <StatTile
        label="Média oficial"
        value={formatNumber(kpis.officialAverage)}
        hint={`Parcial: ${formatNumber(kpis.partialAverage)}`}
        color={scoreColor(kpis.officialAverage)}
      />
      <StatTile
        label="Frequência"
        value={formatNumber(kpis.attendancePercent, "%")}
        hint={`${kpis.belowMinimumAttendance} abaixo de ${MIN_ATTENDANCE_PERCENT}%`}
        color={attendanceColor(kpis.attendancePercent)}
      />
      <StatTile
        label="Em risco"
        value={String(kpis.atRiskStudents)}
        hint="Recuperação ou reprovação"
        color={kpis.atRiskStudents ? colors.danger : colors.text}
      />
      <StatTile
        label="Avaliações"
        value={`${kpis.assessments.completed}/${kpis.assessments.total}`}
        hint="Concluídas no bimestre"
      />
    </View>
  );
});
