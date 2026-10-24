import { ValidationError } from "@/core/domain/errors";
import { isValidDay } from "@/shared/format";
import type { ConsolidationRepository } from "./ConsolidationRepository";
import type { ConsolidationStatus, ConsolidationTemplate, ResponseInput, TemplateDraft } from "./models";
import { buildScale, MAX_TEMPLATE_ITEMS } from "./scale";

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

const buildHeader = (draft: TemplateDraft) => {
  const name = draft.name.trim();
  if (name.length < MIN_TEMPLATE_NAME) {
    throw new ValidationError(`Informe um nome com ao menos ${MIN_TEMPLATE_NAME} letras`);
  }
  return { name, description: draft.description.trim() || null };
};

const buildStructure = (draft: TemplateDraft) => {
  const items = parseItems(draft.items);
  if (!items.length) throw new ValidationError("Informe ao menos um item, um por linha");
  if (items.length > MAX_TEMPLATE_ITEMS) {
    throw new ValidationError(`O modelo aceita no máximo ${MAX_TEMPLATE_ITEMS} itens`);
  }
  return { items: items.map((label) => ({ label })), options: buildScale(draft.scale) };
};

export async function createTemplate({ consolidationRepository }: Dependencies, draft: TemplateDraft) {
  return consolidationRepository.createTemplate({ ...buildHeader(draft), ...buildStructure(draft) });
}

export interface UpdateTemplateInput {
  template: ConsolidationTemplate;
  draft: TemplateDraft;
}

export async function updateTemplate({ consolidationRepository }: Dependencies, { template, draft }: UpdateTemplateInput) {
  const header = buildHeader(draft);
  const changes = template.locked ? header : { ...header, ...buildStructure(draft) };
  return consolidationRepository.updateTemplate(template.id, changes);
}
