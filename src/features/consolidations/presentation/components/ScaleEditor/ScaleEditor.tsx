import { Pressable, Text, View } from "react-native";
import { Button, commonStyles, Field, SegmentedControl } from "@/shared/ui";
import type { ScaleDraft, ScaleOptionDraft } from "../../../domain/models";
import { emptyOption, MAX_SCALE_OPTIONS, MIN_SCALE_OPTIONS, SCALE_COLORS } from "../../../domain/scale";
import { OptionTag } from "../OptionTag";
import { styles } from "./styles";

type ScaleKey = "nominal" | "scored";

const segments: { key: ScaleKey; label: string }[] = [
  { key: "nominal", label: "Sem pontuação" },
  { key: "scored", label: "Com pontuação" },
];

const toPreview = (option: ScaleOptionDraft, index: number) => ({
  id: String(index),
  label: option.label.trim() || `Opção ${index + 1}`,
  summaryLabel: null,
  color: option.color,
  icon: null,
  value: null,
  position: index,
});

interface ScaleEditorProps {
  scale: ScaleDraft;
  onChange: (scale: ScaleDraft) => void;
}

export function ScaleEditor({ scale, onChange }: ScaleEditorProps) {
  const { scored, options } = scale;
  const setOptions = (next: ScaleOptionDraft[]) => onChange({ scored, options: next });
  const update = (index: number, patch: Partial<ScaleOptionDraft>) =>
    setOptions(options.map((option, i) => (i === index ? { ...option, ...patch } : option)));
  const move = (index: number, delta: number) => {
    const next = [...options];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setOptions(next);
  };

  return (
    <View style={styles.editor}>
      <SegmentedControl
        segments={segments}
        value={scored ? "scored" : "nominal"}
        onChange={(key) => onChange({ scored: key === "scored", options })}
      />
      <Text style={commonStyles.muted}>
        {scored
          ? "Cada opção vale pontos e o app calcula o aproveitamento."
          : "As respostas são contadas por opção, sem aproveitamento."}
      </Text>

      {options.map((option, index) => (
        <View key={index} style={styles.option}>
          <View style={commonStyles.spaceBetween}>
            <Text style={styles.optionTitle}>Opção {index + 1}</Text>
            <View style={styles.optionActions}>
              <Button
                variant="ghost"
                title="↑"
                accessibilityLabel={`Subir opção ${index + 1}`}
                disabled={index === 0}
                onPress={() => move(index, -1)}
              />
              <Button
                variant="ghost"
                title="↓"
                accessibilityLabel={`Descer opção ${index + 1}`}
                disabled={index === options.length - 1}
                onPress={() => move(index, 1)}
              />
              <Button
                variant="ghost"
                title="Remover"
                accessibilityLabel={`Remover opção ${index + 1}`}
                disabled={options.length <= MIN_SCALE_OPTIONS}
                onPress={() => setOptions(options.filter((_, i) => i !== index))}
              />
            </View>
          </View>
          <Field
            label="Rótulo"
            value={option.label}
            onChangeText={(label) => update(index, { label })}
            maxLength={40}
            placeholder="Ex.: Acertou"
          />
          <View style={styles.fieldsRow}>
            <View style={commonStyles.grow}>
              <Field
                label="Ícone (opcional)"
                value={option.icon}
                onChangeText={(icon) => update(index, { icon })}
                maxLength={8}
                placeholder="🟩"
              />
            </View>
            {scored ? (
              <View style={commonStyles.grow}>
                <Field
                  label="Valor"
                  value={option.value}
                  onChangeText={(value) => update(index, { value })}
                  keyboardType="decimal-pad"
                  placeholder="0"
                />
              </View>
            ) : null}
          </View>
          <Field
            label="Nome no resumo (opcional)"
            value={option.summaryLabel}
            onChangeText={(summaryLabel) => update(index, { summaryLabel })}
            maxLength={20}
            placeholder="Ex.: Acertos"
          />
          <View style={styles.colors}>
            {SCALE_COLORS.map((color) => {
              const selected = option.color === color;
              return (
                <Pressable
                  key={color}
                  accessibilityRole="button"
                  accessibilityLabel={`Cor ${color} da opção ${index + 1}`}
                  accessibilityState={{ selected }}
                  onPress={() => update(index, { color })}
                  style={[styles.swatch, { backgroundColor: color }, selected && styles.swatchSelected]}
                />
              );
            })}
          </View>
        </View>
      ))}

      <Button
        variant="outline"
        title="+ Adicionar opção"
        disabled={options.length >= MAX_SCALE_OPTIONS}
        onPress={() => setOptions([...options, emptyOption(options.length)])}
      />
      <View style={styles.preview}>
        {options.map((option, index) => (
          <OptionTag key={index} option={toPreview(option, index)} display="text" />
        ))}
      </View>
    </View>
  );
}
