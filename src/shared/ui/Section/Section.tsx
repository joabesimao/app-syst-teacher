import type { ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "../../theme";
import { Card } from "../Card";
import { styles } from "./styles";

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
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titles}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {action}
      </View>
      {loading ? (
        <View style={styles.placeholder}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : empty ? (
        <View style={styles.placeholder}>
          <Text style={styles.subtitle}>{emptyMessage}</Text>
        </View>
      ) : (
        children
      )}
    </Card>
  );
}
