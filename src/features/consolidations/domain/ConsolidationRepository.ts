import type {
  Consolidation,
  ConsolidationSheet,
  ConsolidationStatus,
  ConsolidationTemplate,
  ConsolidationTemplateChanges,
  ConsolidationTemplateScope,
  NewConsolidation,
  NewConsolidationTemplate,
  ResponseInput,
  StudentConsolidation,
} from "./models";

export interface ListConsolidationsParams {
  classId?: string;
  disciplineName?: string;
  signal?: AbortSignal;
}

export interface ListTemplatesParams {
  scope?: ConsolidationTemplateScope;
  signal?: AbortSignal;
}

export interface ConsolidationRepository {
  listTemplates(params: ListTemplatesParams): Promise<ConsolidationTemplate[]>;
  createTemplate(template: NewConsolidationTemplate): Promise<ConsolidationTemplate>;
  updateTemplate(templateId: string, changes: ConsolidationTemplateChanges): Promise<ConsolidationTemplate>;
  duplicateTemplate(templateId: string): Promise<ConsolidationTemplate>;
  deleteTemplate(templateId: string): Promise<void>;
  list(params: ListConsolidationsParams): Promise<Consolidation[]>;
  create(consolidation: NewConsolidation): Promise<{ id: string }>;
  loadSheet(consolidationId: string, signal?: AbortSignal): Promise<ConsolidationSheet>;
  updateStatus(consolidationId: string, status: ConsolidationStatus): Promise<void>;
  delete(consolidationId: string): Promise<void>;
  saveResponses(consolidationId: string, responses: ResponseInput[]): Promise<void>;
  listByStudent(studentId: string, signal?: AbortSignal): Promise<StudentConsolidation[]>;
}
