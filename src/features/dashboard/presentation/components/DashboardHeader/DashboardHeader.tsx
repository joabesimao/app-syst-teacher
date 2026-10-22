import { Text, View } from "react-native";
import { errorMessage } from "@/core/domain/errors";
import { termLabel } from "@/shared/format";
import { Banner, Button, commonStyles } from "@/shared/ui";
import type { DashboardFilters, TeacherDashboard } from "../../../domain/models";
import { styles } from "./styles";

interface DashboardHeaderProps {
  userName?: string;
  data?: TeacherDashboard;
  filters: DashboardFilters;
  error: unknown;
  onOpenFilters: () => void;
  onRetry: () => void;
}

export function DashboardHeader({ userName, data, filters, error, onOpenFilters, onRetry }: DashboardHeaderProps) {
  const className = filters.classId ? data?.classes.find((item) => item.id === filters.classId)?.name : undefined;
  return (
    <View style={styles.header}>
      <View style={styles.text}>
        <Text style={commonStyles.title}>Olá, {userName}</Text>
        {data ? (
          <Text style={commonStyles.subtitle}>
            {termLabel(data.term)} de {data.schoolYear}
            {className ? ` · ${className}` : ""}
            {filters.disciplineName ? ` · ${filters.disciplineName}` : ""}
          </Text>
        ) : null}
      </View>
      {data ? <Button title="Filtros" variant="outline" onPress={onOpenFilters} style={styles.filterButton} /> : null}
      {error ? <Banner message={errorMessage(error)} onAction={onRetry} /> : null}
      {data && !data.classes.length ? (
        <Banner tone="info" message="Você ainda não tem turmas atribuídas neste ano letivo." />
      ) : null}
    </View>
  );
}
