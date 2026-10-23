import type {
  ConsolidationCells,
  ConsolidationItem,
  ConsolidationScaleKind,
  ConsolidationScaleOption,
  ConsolidationStatus,
  ItemSummary,
  SheetStudent,
  StudentSummary,
  TotalSummary,
} from "../domain/models";

export interface ApiConsolidationTemplate {
  id: string;
  name: string;
  description: string | null;
  disciplineName: string | null;
  gradeLevel: string | null;
  ownerTeacherId: string | null;
  isActive: boolean;
  lockedAt: string | null;
  items: ConsolidationItem[];
  options: ConsolidationScaleOption[];
}

export interface ApiConsolidationBase {
  id: string;
  templateId: string;
  classId: string;
  disciplineName: string;
  title: string | null;
  date: string;
  academicTerm: number;
  status: ConsolidationStatus;
}

export interface ApiConsolidationListItem extends ApiConsolidationBase {
  template: { id: string; name: string };
  schoolClass: { id: string; name: string };
  responsesCount: number;
}

export interface ApiConsolidationSheet {
  consolidation: ApiConsolidationBase;
  school: { id: string; name: string };
  schoolClass: { id: string; name: string; gradeLevel: string; schoolYear: number };
  teacher: { id: string; fullName: string };
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

export interface ApiStudentConsolidation {
  consolidation: ApiConsolidationBase;
  templateName: string;
  className: string;
  scaleKind: ConsolidationScaleKind;
  items: ConsolidationItem[];
  options: ConsolidationScaleOption[];
  responses: ConsolidationCells;
  summary: StudentSummary;
}
