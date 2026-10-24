import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { errorMessage } from "@/core/domain/errors";
import { Banner, Button, Card, ChipGroup, commonStyles, Field } from "@/shared/ui";
import type { ConsolidationTemplate, TemplateDraft } from "../../../domain/models";
import { SCALE_PRESETS, scaleFromTemplate } from "../../../domain/scale";
import { parseItems } from "../../../domain/usecases";
import { ScaleEditor } from "../ScaleEditor";
import { TemplatePreview } from "../TemplatePreview";
import { styles } from "./styles";

const presetOptions = SCALE_PRESETS.map((preset) => ({ value: preset.id, label: preset.name }));

interface TemplateFormProps {
  initial: TemplateDraft;
  initialPreset?: string;
  sources: ConsolidationTemplate[];
  locked?: ConsolidationTemplate;
  submitTitle: string;
  loading: boolean;
  error: unknown;
  errorFallback: string;
  onSubmit: (draft: TemplateDraft) => void;
}

export function TemplateForm({
  initial,
  initialPreset = "",
  sources,
  locked,
  submitTitle,
  loading,
  error,
  errorFallback,
  onSubmit,
}: TemplateFormProps) {
  const [draft, setDraft] = useState(initial);
  const [source, setSource] = useState(initialPreset);
  const change = (patch: Partial<TemplateDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const choosePreset = (id: string) => {
    const preset = SCALE_PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setSource(id);
    change({ scale: preset.scale });
  };
  const chooseTemplate = (id: string) => {
    const template = sources.find((item) => item.id === id);
    if (!template) return;
    setSource(id);
    change({ scale: scaleFromTemplate(template) });
  };

  return (
    <ScrollView
      style={commonStyles.screen}
      contentContainerStyle={commonStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Card style={styles.card}>
        <Field
          label="Nome"
          value={draft.name}
          onChangeText={(name) => change({ name })}
          maxLength={120}
          placeholder="Ex.: Problemas com frações"
        />
        <Field
          label="Descrição (opcional)"
          value={draft.description}
          onChangeText={(description) => change({ description })}
          maxLength={500}
          multiline
        />
        {locked ? null : (
          <View style={styles.group}>
            <Field
              label="Itens (um por linha)"
              value={draft.items}
              onChangeText={(items) => change({ items })}
              multiline
              style={styles.items}
              placeholder={"Adição\nSubtração"}
            />
            <Text style={commonStyles.muted}>{parseItems(draft.items).length} itens</Text>
          </View>
        )}
      </Card>

      {locked ? (
        <Card style={styles.card}>
          <Banner tone="info" message="Modelo já aplicado. Duplique o modelo para alterar itens ou escala." />
          <TemplatePreview template={locked} />
        </Card>
      ) : (
        <Card style={styles.card}>
          <Text style={commonStyles.sectionTitle}>Escala</Text>
          <ChipGroup label="Começar com uma escala pronta" options={presetOptions} value={source} onChange={choosePreset} />
          {sources.length ? (
            <ChipGroup
              label="Ou copiar a escala de um modelo"
              options={sources.map((template) => ({ value: template.id, label: template.name }))}
              value={source}
              onChange={chooseTemplate}
            />
          ) : null}
          <ScaleEditor scale={draft.scale} onChange={(scale) => change({ scale })} />
        </Card>
      )}

      {error ? <Banner message={errorMessage(error, errorFallback)} /> : null}
      <Button title={submitTitle} onPress={() => onSubmit(draft)} loading={loading} />
    </ScrollView>
  );
}
