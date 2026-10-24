import { Text, View } from "react-native";
import { plural } from "@/shared/format";
import { commonStyles } from "@/shared/ui";
import type { ConsolidationTemplate } from "../../../domain/models";
import { OptionTag } from "../OptionTag";
import { styles } from "./styles";

export function TemplatePreview({ template }: { template: ConsolidationTemplate }) {
  const scored = template.options.every((option) => option.value !== null);
  return (
    <View style={styles.container}>
      {template.description ? <Text style={commonStyles.muted}>{template.description}</Text> : null}
      <Text style={commonStyles.muted}>
        {plural(template.items.length, "item", "itens")}: {template.items.map((item) => item.label).join(", ")}
      </Text>
      <View style={styles.scale}>
        {template.options.map((option) => (
          <OptionTag key={option.id} option={option} display="text" />
        ))}
      </View>
      <Text style={commonStyles.muted}>
        {scored ? "Escala com valor: calcula o aproveitamento." : "Escala sem valor: mostra a distribuição."}
      </Text>
    </View>
  );
}
