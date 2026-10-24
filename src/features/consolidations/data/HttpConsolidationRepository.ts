import type { ApiPage } from "@/core/http/ApiPage";
import type { HttpClient } from "@/core/http/HttpClient";
import type {
  ConsolidationRepository,
  ListConsolidationsParams,
  ListTemplatesParams,
} from "../domain/ConsolidationRepository";
import type {
  Consolidation,
  ConsolidationSheet,
  ConsolidationStatus,
  ConsolidationTemplate,
  NewConsolidation,
  NewConsolidationTemplate,
  ResponseInput,
  StudentConsolidation,
} from "../domain/models";
import type {
  ApiConsolidationListItem,
  ApiConsolidationSheet,
  ApiConsolidationTemplate,
  ApiStudentConsolidation,
} from "./dto";
import { toConsolidation, toSheet, toStudentConsolidation, toTemplate } from "./mappers";

const MAX_PAGE_SIZE = 100;

export class HttpConsolidationRepository implements ConsolidationRepository {
  constructor(private readonly http: HttpClient) {}

  async listTemplates({ scope, signal }: ListTemplatesParams): Promise<ConsolidationTemplate[]> {
    const response = await this.http.get<ApiPage<ApiConsolidationTemplate>>("/consolidation-templates", {
      query: { scope, limit: MAX_PAGE_SIZE },
      signal,
    });
    return response.data.map(toTemplate);
  }

  async createTemplate(template: NewConsolidationTemplate): Promise<ConsolidationTemplate> {
    return toTemplate(await this.http.post<ApiConsolidationTemplate>("/consolidation-templates", template));
  }

  async duplicateTemplate(templateId: string): Promise<ConsolidationTemplate> {
    return toTemplate(
      await this.http.post<ApiConsolidationTemplate>(`/consolidation-templates/${templateId}/duplicate`)
    );
  }

  async deleteTemplate(templateId: string): Promise<void> {
    await this.http.delete(`/consolidation-templates/${templateId}`);
  }

  async list({ classId, disciplineName, signal }: ListConsolidationsParams): Promise<Consolidation[]> {
    const response = await this.http.get<ApiPage<ApiConsolidationListItem>>("/consolidations", {
      query: { classId, disciplineName, limit: MAX_PAGE_SIZE },
      signal,
    });
    return response.data.map(toConsolidation);
  }

  create(consolidation: NewConsolidation): Promise<{ id: string }> {
    return this.http.post<{ id: string }>("/consolidations", consolidation);
  }

  async loadSheet(consolidationId: string, signal?: AbortSignal): Promise<ConsolidationSheet> {
    return toSheet(await this.http.get<ApiConsolidationSheet>(`/consolidations/${consolidationId}`, { signal }));
  }

  async updateStatus(consolidationId: string, status: ConsolidationStatus): Promise<void> {
    await this.http.patch(`/consolidations/${consolidationId}`, { status });
  }

  async delete(consolidationId: string): Promise<void> {
    await this.http.delete(`/consolidations/${consolidationId}`);
  }

  async saveResponses(consolidationId: string, responses: ResponseInput[]): Promise<void> {
    await this.http.put(`/consolidations/${consolidationId}/responses`, { responses });
  }

  async listByStudent(studentId: string, signal?: AbortSignal): Promise<StudentConsolidation[]> {
    const response = await this.http.get<ApiStudentConsolidation[]>(`/students/${studentId}/consolidations`, {
      signal,
    });
    return response.map(toStudentConsolidation);
  }
}
