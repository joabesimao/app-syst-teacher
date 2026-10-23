import { Text, View } from "react-native";
import { errorMessage } from "@/core/domain/errors";
import { formatDate, termLabel } from "@/shared/format";
import { Banner, commonStyles, Section } from "@/shared/ui";
import type { StudentConsolidation } from "../../../domain/models";
import { consolidationLabel, countOf, formatPerformance, summaryLabel } from "../../../domain/rules";
import { useStudentConsolidations } from "../../hooks/useStudentConsolidations";
import { OptionTag } from "../OptionTag";
import { styles } from "./styles";

function StudentConsolidationRow({ record }: { record: StudentConsolidation }) {
  const options = new Map(record.options.map((option) => [option.id, option]));
  return (
    <View style={styles.row}>
      <View style={commonStyles.spaceBetween}>
        <Text style={[commonStyles.text, commonStyles.grow]}>{consolidationLabel(record)}</Text>
        <Text style={styles.value}>
          {record.scaleKind === "SCORED"
            ? formatPerformance(record.summary.performance)
            : record.options.map((option) => `${countOf(record.summary.counts, option.id)} ${summaryLabel(option)}`).join(" · ")}
        </Text>
      </View>
      <Text style={commonStyles.muted}>
        {record.disciplineName} · {formatDate(record.date)} · {termLabel(record.academicTerm)}
      </Text>
      <View style={styles.items}>
        {record.items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <OptionTag option={options.get(record.responses[item.id] ?? "")} display="icon" />
          </View>
        ))}
      </View>
    </View>
  );
}

export function StudentConsolidationsSection({ studentId }: { studentId: string }) {
  const { data, isPending, error, refetch } = useStudentConsolidations(studentId);
  return (
    <Section
      title="Consolidações"
      subtitle="Respostas do aluno em cada aplicação"
      loading={isPending}
      empty={!error && !data?.length}
      emptyMessage="Nenhuma consolidação com respostas deste aluno."
    >
      {error ? <Banner message={errorMessage(error)} onAction={() => void refetch()} /> : null}
      {data?.map((record) => <StudentConsolidationRow key={record.id} record={record} />)}
    </Section>
  );
}
