import { memo } from "react";
import { Text, View } from "react-native";
import { Button, Card, Chip, commonStyles } from "@/shared/ui";
import type { ConsolidationTemplate } from "../../../domain/models";
import { TemplatePreview } from "../TemplatePreview";
import { styles } from "./styles";

interface TemplateCardProps {
  template: ConsolidationTemplate;
  mine: boolean;
  busy: boolean;
  onDuplicate: (template: ConsolidationTemplate) => void;
  onDelete: (template: ConsolidationTemplate) => void;
}

export const TemplateCard = memo(function TemplateCard({ template, mine, busy, onDuplicate, onDelete }: TemplateCardProps) {
  return (
    <Card style={styles.card}>
      <View style={commonStyles.spaceBetween}>
        <Text style={[commonStyles.sectionTitle, commonStyles.grow]}>{template.name}</Text>
        <Chip label={mine ? "Meu" : "Da escola"} tone={mine ? "info" : "neutral"} />
      </View>
      <View style={commonStyles.row}>
        {template.disciplineName ? <Chip label={template.disciplineName} /> : null}
        {template.locked ? <Chip label="Em uso" tone="warning" /> : null}
        {template.isActive ? null : <Chip label="Inativo" tone="danger" />}
      </View>
      <TemplatePreview template={template} />
      <View style={styles.actions}>
        <Button variant="ghost" title="Duplicar" disabled={busy} onPress={() => onDuplicate(template)} />
        {mine && !template.locked ? (
          <Button variant="ghost" title="Excluir" disabled={busy} onPress={() => onDelete(template)} />
        ) : null}
      </View>
    </Card>
  );
});
