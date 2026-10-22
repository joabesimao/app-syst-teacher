export interface ApiClass {
  id: string;
  name: string;
  gradeLevel: string;
  schoolYear: number;
  shift?: string | null;
  isActive: boolean;
}

export interface ApiAssignment {
  classId: string;
  disciplineName: string;
  schoolClass: ApiClass;
}

export interface ApiCurrentUser {
  teacher: { id: string; fullName: string; assignments: ApiAssignment[] } | null;
}
