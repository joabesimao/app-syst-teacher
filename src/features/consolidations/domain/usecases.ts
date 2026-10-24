import { ValidationError } from "@/core/domain/errors";
import { isValidDay } from "@/shared/format";
import type { ConsolidationRepository } from "./ConsolidationRepository";
import type { ConsolidationStatus, ConsolidationTemplate, ResponseInput } from "./models";

type Dependencies = { consolidationRepository: ConsolidationRepository };

export const RESPONSES_LOCKED_MESSAGE = "Consolidação concluída. Reabra para alterar as respostas.";

export interface CreateConsolidationInput {
  classId: string;
  disciplineName: string;
  templateId: string | null;
  date: string;
  title: string;
}

export async function createConsolidation(
  { consolidationRepository }: Dependencies,
  { classId, disciplineName, templateId, date, title }: CreateConsolidationInput
) {
  if (!templateId) throw new ValidationError("Escolha um modelo de consolidação");
  if (!isValidDay(date)) throw new ValidationError("Data inválida. Use o formato AAAA-MM-DD");
  return consolidationRepository.create({
    templateId,
    classId,
    disciplineName,
    date,
    title: title.trim() || null,
  });
}

export interface SaveResponsesInput {
  consolidationId: string;
  status: ConsolidationStatus;
  responses: ResponseInput[];
}

export async function saveResponses(
  { consolidationRepository }: Dependencies,
  { consolidationId, status, responses }: SaveResponsesInput
) {
  if (status !== "IN_PROGRESS") throw new ValidationError(RESPONSES_LOCKED_MESSAGE);
  if (!responses.length) return;
  await consolidationRepository.saveResponses(consolidationId, responses);
}

export interface CreateTemplateInput {
  name: string;
  items: string;
  base: ConsolidationTemplate | null;
}

export const MIN_TEMPLATE_NAME = 3;

export const parseItems = (text: string) => {
  const seen = new Set<string>();
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((label) => {
      const key = label.toLowerCase();
      if (!label || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export async function createTemplate({ consolidationRepository }: Dependencies, input: CreateTemplateInput) {
  const name = input.name.trim();
  if (name.length < MIN_TEMPLATE_NAME) {
    throw new ValidationError(`Informe um nome com ao menos ${MIN_TEMPLATE_NAME} letras`);
  }
  const items = parseItems(input.items);
  if (!items.length) throw new ValidationError("Informe ao menos um item, um por linha");
  if (!input.base) throw new ValidationError("Escolha de qual modelo copiar a escala");
  return consolidationRepository.createTemplate({
    name,
    items: items.map((label) => ({ label })),
    options: input.base.options.map(({ label, summaryLabel, color, icon, value }) => ({
      label,
      summaryLabel,
      color,
      icon,
      value,
    })),
  });
}
