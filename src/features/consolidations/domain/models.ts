export type ConsolidationStatus = "IN_PROGRESS" | "COMPLETED";

export type ConsolidationScaleKind = "SCORED" | "NOMINAL";

export type ConsolidationTemplateScope = "SCHOOL" | "MINE";

export interface ConsolidationItem {
  id: string;
  label: string;
  position: number;
}

export interface ConsolidationScaleOption {
  id: string;
  label: string;
  summaryLabel: string | null;
  color: string;
  icon: string | null;
  value: number | null;
  position: number;
}

export interface ConsolidationTemplate {
  id: string;
  name: string;
  description: string | null;
  disciplineName: string | null;
  gradeLevel: string | null;
  ownerTeacherId: string | null;
  isActive: boolean;
  locked: boolean;
  items: ConsolidationItem[];
  options: ConsolidationScaleOption[];
}

export interface NewScaleOption {
  label: string;
  summaryLabel: string | null;
  color: string;
  icon: string | null;
  value: number | null;
}

export interface NewConsolidationTemplate {
  name: string;
  description?: string | null;
  items: { label: string }[];
  options: NewScaleOption[];
}

export type ConsolidationTemplateChanges = Partial<NewConsolidationTemplate>;

export interface ScaleOptionDraft {
  label: string;
  summaryLabel: string;
  color: string;
  icon: string;
  value: string;
}

export interface ScaleDraft {
  scored: boolean;
  options: ScaleOptionDraft[];
}

export interface TemplateDraft {
  name: string;
  description: string;
  items: string;
  scale: ScaleDraft;
}

export interface ScalePreset {
  id: string;
  name: string;
  scale: ScaleDraft;
}

export interface Consolidation {
  id: string;
  templateId: string;
  templateName: string;
  classId: string;
  className: string;
  disciplineName: string;
  title: string | null;
  date: string;
  academicTerm: number;
  status: ConsolidationStatus;
  responsesCount: number;
}

export interface NewConsolidation {
  templateId: string;
  classId: string;
  disciplineName: string;
  date: string;
  title: string | null;
}

export type OptionCounts = Record<string, number>;

export type ConsolidationCells = Record<string, string | null>;

export interface StudentSummary {
  studentId: string;
  answered: number;
  complete: boolean;
  counts: OptionCounts;
  performance: number | null;
}

export interface ItemSummary {
  itemId: string;
  answered: number;
  counts: OptionCounts;
  performance: number | null;
}

export interface TotalSummary {
  answered: number;
  expected: number;
  counts: OptionCounts;
  performance: number | null;
}

export interface SheetStudent {
  studentId: string;
  fullName: string;
  registration: string;
  transferred: boolean;
  responses: ConsolidationCells;
}

export interface ConsolidationSheet {
  consolidation: {
    id: string;
    title: string | null;
    date: string;
    academicTerm: number;
    status: ConsolidationStatus;
    disciplineName: string;
  };
  schoolName: string;
  schoolClass: { id: string; name: string; gradeLevel: string; schoolYear: number };
  teacherName: string;
  template: {
    id: string;
    name: string;
    scaleKind: ConsolidationScaleKind;
    items: ConsolidationItem[];
    options: ConsolidationScaleOption[];
  };
  students: SheetStudent[];
  summary: {
    scaleKind: ConsolidationScaleKind;
    students: StudentSummary[];
    items: ItemSummary[];
    total: TotalSummary;
  };
}

export interface ResponseInput {
  studentId: string;
  itemId: string;
  optionId: string | null;
}

export interface StudentConsolidation {
  id: string;
  title: string | null;
  date: string;
  academicTerm: number;
  status: ConsolidationStatus;
  disciplineName: string;
  templateName: string;
  className: string;
  scaleKind: ConsolidationScaleKind;
  items: ConsolidationItem[];
  options: ConsolidationScaleOption[];
  responses: ConsolidationCells;
  summary: StudentSummary;
}

export type CellDisplay = "text" | "icon";
