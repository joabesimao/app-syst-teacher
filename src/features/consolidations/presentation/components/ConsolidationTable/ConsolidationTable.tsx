import { useMemo } from "react";
import { Text } from "react-native";
import type { DataTableColumn } from "@/shared/ui";
import { DataTable } from "@/shared/ui";
import type { CellDisplay, ConsolidationSheet, SheetStudent, StudentSummary } from "../../../domain/models";
import { countOf, formatPerformance, summaryLabel } from "../../../domain/rules";
import { OptionTag } from "../OptionTag";
import { styles } from "./styles";

interface ConsolidationTableProps {
  sheet: ConsolidationSheet;
  display: CellDisplay;
  onStudentPress?: (student: SheetStudent) => void;
}

const ITEM_WIDTH = 96;
const COUNT_WIDTH = 72;
const PERFORMANCE_WIDTH = 104;

export function ConsolidationTable({ sheet, display, onStudentPress }: ConsolidationTableProps) {
  const { template, summary } = sheet;
  const scored = summary.scaleKind === "SCORED";

  const columns = useMemo(() => {
    const options = new Map(template.options.map((option) => [option.id, option]));
    const summaries = new Map(summary.students.map((student) => [student.studentId, student]));
    const itemSummaries = new Map(summary.items.map((item) => [item.itemId, item]));
    const studentSummary = (student: SheetStudent): StudentSummary | undefined => summaries.get(student.studentId);

    const itemColumns: DataTableColumn<SheetStudent>[] = template.items.map((item) => {
      const itemSummary = itemSummaries.get(item.id);
      return {
        key: item.id,
        title: item.label,
        width: ITEM_WIDTH,
        render: (student) => <OptionTag option={options.get(student.responses[item.id] ?? "")} display={display} />,
        footer: scored ? formatPerformance(itemSummary?.performance ?? null) : String(itemSummary?.answered ?? 0),
      };
    });

    const countColumns: DataTableColumn<SheetStudent>[] = template.options.map((option) => ({
      key: `count-${option.id}`,
      title: summaryLabel(option),
      width: COUNT_WIDTH,
      render: (student) => {
        const counts = studentSummary(student)?.counts ?? {};
        return <Text style={[styles.count, { color: option.color }]}>{countOf(counts, option.id)}</Text>;
      },
      footer: String(countOf(summary.total.counts, option.id)),
    }));

    const performanceColumn: DataTableColumn<SheetStudent>[] = scored
      ? [
          {
            key: "performance",
            title: "Aproveitamento",
            width: PERFORMANCE_WIDTH,
            render: (student) => formatPerformance(studentSummary(student)?.performance ?? null),
            footer: formatPerformance(summary.total.performance),
          },
        ]
      : [];

    return [...itemColumns, ...countColumns, ...performanceColumn];
  }, [template, summary, display, scored]);

  return (
    <DataTable
      rows={sheet.students}
      rowKey={(student) => student.studentId}
      columns={columns}
      stickyTitle="Aluno"
      renderSticky={(student, index) => (
        <Text style={[styles.name, student.transferred && styles.transferred]} numberOfLines={2}>
          {index + 1}. {student.fullName}
        </Text>
      )}
      footerLabel="Total da turma"
      onRowPress={onStudentPress}
      rowLabel={(student) => `Lançar respostas de ${student.fullName}`}
    />
  );
}
