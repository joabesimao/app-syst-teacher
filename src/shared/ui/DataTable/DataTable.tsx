import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "./styles";

export interface DataTableColumn<Row> {
  key: string;
  title: string;
  width?: number;
  render: (row: Row, index: number) => ReactNode;
  footer?: ReactNode;
}

interface DataTableProps<Row> {
  rows: Row[];
  rowKey: (row: Row) => string;
  columns: DataTableColumn<Row>[];
  stickyTitle: string;
  renderSticky: (row: Row, index: number) => ReactNode;
  stickyWidth?: number;
  footerLabel?: string;
  onRowPress?: (row: Row) => void;
  rowLabel?: (row: Row) => string;
}

const DEFAULT_WIDTH = 72;

const asContent = (content: ReactNode) =>
  typeof content === "string" || typeof content === "number" ? (
    <Text style={styles.cellText}>{content}</Text>
  ) : (
    content
  );

export function DataTable<Row>({
  rows,
  rowKey,
  columns,
  stickyTitle,
  renderSticky,
  stickyWidth = 150,
  footerLabel,
  onRowPress,
  rowLabel,
}: DataTableProps<Row>) {
  const hasFooter = footerLabel !== undefined;

  const stickyCell = (row: Row, index: number) => {
    const content = <View style={[styles.cell, styles.stickyCell]}>{asContent(renderSticky(row, index))}</View>;
    if (!onRowPress) return <View key={rowKey(row)}>{content}</View>;
    return (
      <Pressable
        key={rowKey(row)}
        accessibilityRole="button"
        accessibilityLabel={rowLabel?.(row)}
        onPress={() => onRowPress(row)}
        style={({ pressed }) => pressed && styles.pressed}
      >
        {content}
      </Pressable>
    );
  };

  return (
    <View style={styles.table}>
      <View style={[styles.sticky, { width: stickyWidth }]}>
        <View style={[styles.cell, styles.headerCell, styles.stickyCell]}>
          <Text style={styles.headerText}>{stickyTitle}</Text>
        </View>
        {rows.map(stickyCell)}
        {hasFooter ? (
          <View style={[styles.cell, styles.footerCell, styles.stickyCell]}>
            <Text style={styles.footerText}>{footerLabel}</Text>
          </View>
        ) : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator bounces={false}>
        <View>
          <View style={styles.row}>
            {columns.map((column) => (
              <View key={column.key} style={[styles.cell, styles.headerCell, { width: column.width ?? DEFAULT_WIDTH }]}>
                <Text style={styles.headerText} numberOfLines={2}>
                  {column.title}
                </Text>
              </View>
            ))}
          </View>
          {rows.map((row, index) => (
            <View key={rowKey(row)} style={styles.row}>
              {columns.map((column) => (
                <View key={column.key} style={[styles.cell, styles.center, { width: column.width ?? DEFAULT_WIDTH }]}>
                  {asContent(column.render(row, index))}
                </View>
              ))}
            </View>
          ))}
          {hasFooter ? (
            <View style={styles.row}>
              {columns.map((column) => (
                <View
                  key={column.key}
                  style={[styles.cell, styles.footerCell, styles.center, { width: column.width ?? DEFAULT_WIDTH }]}
                >
                  {typeof column.footer === "string" || typeof column.footer === "number" ? (
                    <Text style={styles.footerText}>{column.footer}</Text>
                  ) : (
                    column.footer
                  )}
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
