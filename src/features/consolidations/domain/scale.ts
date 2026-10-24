import { ValidationError } from "@/core/domain/errors";
import type {
  ConsolidationTemplate,
  NewScaleOption,
  ScaleDraft,
  ScaleOptionDraft,
  ScalePreset,
  TemplateDraft,
} from "./models";

export const MIN_SCALE_OPTIONS = 2;
export const MAX_SCALE_OPTIONS = 10;
export const MAX_TEMPLATE_ITEMS = 30;

export const SCALE_COLORS = [
  "#2E7D32",
  "#C62828",
  "#EF6C00",
  "#F9A825",
  "#1565C0",
  "#6A1B9A",
  "#00838F",
  "#AD1457",
  "#5D4037",
  "#455A64",
];

const option = (label: string, color: string, extra: Partial<ScaleOptionDraft> = {}): ScaleOptionDraft => ({
  label,
  color,
  summaryLabel: "",
  icon: "",
  value: "",
  ...extra,
});

export const emptyOption = (index: number): ScaleOptionDraft =>
  option("", SCALE_COLORS[index % SCALE_COLORS.length]);

export const SCALE_PRESETS: ScalePreset[] = [
  {
    id: "right-wrong",
    name: "Acertou / Errou",
    scale: {
      scored: true,
      options: [
        option("Acertou", "#2E7D32", { summaryLabel: "Acertos", icon: "🟩", value: "1" }),
        option("Errou", "#C62828", { summaryLabel: "Erros", icon: "🟥", value: "0" }),
      ],
    },
  },
  {
    id: "yes-no",
    name: "Sim / Não",
    scale: {
      scored: true,
      options: [
        option("Sim", "#2E7D32", { icon: "✅", value: "1" }),
        option("Não", "#C62828", { icon: "❌", value: "0" }),
      ],
    },
  },
  {
    id: "concepts",
    name: "Fraco a Ótimo",
    scale: {
      scored: true,
      options: [
        option("Fraco", "#C62828", { value: "0" }),
        option("Regular", "#EF6C00", { value: "1" }),
        option("Bom", "#1565C0", { value: "2" }),
        option("Ótimo", "#2E7D32", { value: "3" }),
      ],
    },
  },
  {
    id: "levels",
    name: "Níveis 1 a 4",
    scale: {
      scored: true,
      options: ["#C62828", "#EF6C00", "#F9A825", "#2E7D32"].map((color, index) =>
        option(`Nível ${index + 1}`, color, { value: String(index + 1) })
      ),
    },
  },
  {
    id: "writing",
    name: "Hipótese de escrita",
    scale: {
      scored: false,
      options: [
        option("Pré-silábico", "#C62828"),
        option("Silábico", "#EF6C00"),
        option("Silábico-alfabético", "#F9A825"),
        option("Alfabético", "#2E7D32"),
      ],
    },
  },
  {
    id: "blank",
    name: "Do zero",
    scale: { scored: false, options: [emptyOption(0), emptyOption(1)] },
  },
];

export const scaleFromTemplate = (template: Pick<ConsolidationTemplate, "options">): ScaleDraft => ({
  scored: template.options.every((item) => item.value !== null),
  options: template.options.map((item) => ({
    label: item.label,
    summaryLabel: item.summaryLabel ?? "",
    color: item.color,
    icon: item.icon ?? "",
    value: item.value === null ? "" : String(item.value),
  })),
});

export const draftFromTemplate = (template: ConsolidationTemplate): TemplateDraft => ({
  name: template.name,
  description: template.description ?? "",
  items: template.items.map((item) => item.label).join("\n"),
  scale: scaleFromTemplate(template),
});

const parseValue = (text: string) => {
  const normalized = text.trim().replace(",", ".");
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 ? value : null;
};

const optionalText = (text: string) => text.trim() || null;

export function buildScale({ scored, options }: ScaleDraft): NewScaleOption[] {
  if (options.length < MIN_SCALE_OPTIONS) {
    throw new ValidationError(`A escala precisa de ao menos ${MIN_SCALE_OPTIONS} opções`);
  }
  if (options.length > MAX_SCALE_OPTIONS) {
    throw new ValidationError(`A escala aceita no máximo ${MAX_SCALE_OPTIONS} opções`);
  }
  const labels = options.map((item) => item.label.trim());
  if (labels.some((label) => !label)) throw new ValidationError("Preencha o rótulo de todas as opções");
  if (new Set(labels.map((label) => label.toLocaleLowerCase("pt-BR"))).size !== labels.length) {
    throw new ValidationError("Existem opções repetidas na escala");
  }
  const values = options.map((item) => (scored ? parseValue(item.value) : null));
  if (scored) {
    if (values.some((value) => value === null)) {
      throw new ValidationError("Informe um valor (0 ou mais) em todas as opções");
    }
    if (Math.max(...(values as number[])) <= 0) {
      throw new ValidationError("Ao menos uma opção precisa valer mais que zero");
    }
  }
  return options.map((item, index) => ({
    label: labels[index],
    summaryLabel: optionalText(item.summaryLabel),
    color: item.color,
    icon: optionalText(item.icon),
    value: values[index],
  }));
}
