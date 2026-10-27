export type SchoolShift = "MORNING" | "AFTERNOON" | "EVENING" | "FULL_TIME";

export interface SchoolClass {
  id: string;
  name: string;
  gradeLevel: string;
  schoolYear: number;
  shift: SchoolShift | null;
  isActive: boolean;
}

export interface TeacherAssignment {
  classId: string;
  disciplineName: string;
  schoolClass: SchoolClass;
}

export interface CurrentTeacher {
  id: string;
  fullName: string;
  assignments: TeacherAssignment[];
}

export interface NewSchoolClass {
  name: string;
  gradeLevel: string;
  schoolYear: number;
  shift?: SchoolShift;
  disciplineName?: string;
}

export interface SchoolClassDraft {
  name: string;
  gradeLevel: string;
  schoolYear: string;
  shift: SchoolShift | null;
  disciplineName: string;
}
