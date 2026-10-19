import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";
import { Card } from "./ui";

interface SectionProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
}

export function Section({
  title,
  subtitle,
  action,
  loading,
  empty,
  emptyMessage = "Sem dados para os filtros selecionados.",
  children,
}: SectionProps) {
  return (
    <Card style={sectionStyles.card}>
      <View style={sectionStyles.header}>
        <View style={sectionStyles.titles}>
          <Text style={sectionStyles.title}>{title}</Text>
          {subtitle ? <Text style={sectionStyles.subtitle}>{subtitle}</Text> : null}
        </View>
        {action}
      </View>
      {loading ? (
        <View style={sectionStyles.placeholder}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : empty ? (
        <View style={sectionStyles.placeholder}>
          <Text style={sectionStyles.subtitle}>{emptyMessage}</Text>
        </View>
      ) : (
        children
      )}
    </Card>
  );
}

const sectionStyles = StyleSheet.create({
  card: { gap: spacing(1.5) },
  header: { flexDirection: "row", alignItems: "flex-start", gap: spacing(1) },
  titles: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 12, color: colors.muted },
  placeholder: { minHeight: 120, alignItems: "center", justifyContent: "center" },
});
