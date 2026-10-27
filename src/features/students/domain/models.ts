export interface Student {
  id: string;
  fullName: string;
  registration: string;
  classId: string;
  isActive: boolean;
}

export interface NewStudent {
  classId: string;
  fullName: string;
  registration: string;
  birthDate?: string;
  email?: string;
  phone?: string;
}

export interface StudentDraft {
  fullName: string;
  registration: string;
  birthDate: string;
  email: string;
  phone: string;
}
