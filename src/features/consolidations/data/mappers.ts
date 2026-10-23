import type {
  Consolidation,
  ConsolidationSheet,
  ConsolidationTemplate,
  StudentConsolidation,
} from "../domain/models";
import type {
  ApiConsolidationBase,
  ApiConsolidationListItem,
  ApiConsolidationSheet,
  ApiConsolidationTemplate,
  ApiStudentConsolidation,
} from "./dto";

const byPosition = <T extends { position: number }>(list: T[]) => [...list].sort((a, b) => a.position - b.position);

const day = (value: string) => value.slice(0, 10);

const toHeader = (consolidation: ApiConsolidationBase) => ({
  id: consolidation.id,
  title: consolidation.title,
  date: day(consolidation.date),
  academicTerm: consolidation.academicTerm,
  status: consolidation.status,
  disciplineName: consolidation.disciplineName,
});

export const toTemplate = (template: ApiConsolidationTemplate): ConsolidationTemplate => ({
  id: template.id,
  name: template.name,
  description: template.description,
  disciplineName: template.disciplineName,
  gradeLevel: template.gradeLevel,
  ownerTeacherId: template.ownerTeacherId,
  isActive: template.isActive,
  locked: template.lockedAt !== null,
  items: byPosition(template.items),
  options: byPosition(template.options),
});

export const toConsolidation = (item: ApiConsolidationListItem): Consolidation => ({
  id: item.id,
  templateId: item.templateId,
  templateName: item.template.name,
  classId: item.classId,
  className: item.schoolClass.name,
  disciplineName: item.disciplineName,
  title: item.title,
  date: day(item.date),
  academicTerm: item.academicTerm,
  status: item.status,
  responsesCount: item.responsesCount,
});

export const toSheet = (sheet: ApiConsolidationSheet): ConsolidationSheet => ({
  consolidation: toHeader(sheet.consolidation),
  schoolName: sheet.school.name,
  schoolClass: sheet.schoolClass,
  teacherName: sheet.teacher.fullName,
  template: {
    ...sheet.template,
    items: byPosition(sheet.template.items),
    options: byPosition(sheet.template.options),
  },
  students: sheet.students,
  summary: sheet.summary,
});

export const toStudentConsolidation = (record: ApiStudentConsolidation): StudentConsolidation => ({
  ...toHeader(record.consolidation),
  templateName: record.templateName,
  className: record.className,
  scaleKind: record.scaleKind,
  items: byPosition(record.items),
  options: byPosition(record.options),
  responses: record.responses,
  summary: record.summary,
});
