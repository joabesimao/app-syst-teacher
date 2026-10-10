export type AcademicTerm = "1" | "2" | "3" | "4";

export type SchoolShift = "MORNING" | "AFTERNOON" | "EVENING" | "FULL_TIME";

export interface SchoolClass {
  id: string;
  name: string;
  gradeLevel: string;
  schoolYear: number;
  shift: SchoolShift | null;
  isActive: boolean;
}

export interface Student {
  id: string;
  fullName: string;
  registration: string;
  classId: string;
  birthDate?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
}

export interface TeacherAssignment {
  classId: string;
  disciplineName: string;
  workloadHours?: number;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  cpf: string;
  isActive: boolean;
  assignments: TeacherAssignment[];
}

export interface TeacherClassAssignment extends TeacherAssignment {
  schoolClass: SchoolClass;
}

export interface CurrentTeacher extends Omit<Teacher, "assignments"> {
  assignments: TeacherClassAssignment[];
}

export type AssessmentStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

export interface Assessment {
  id: string;
  title: string;
  classId: string;
  discipline: string;
  teacherId: string;
  academicTerm: AcademicTerm;
  maxScore: number;
  weight: number;
  dueDate: string;
  status: AssessmentStatus;
}

export interface StudentGrade {
  studentId: string;
  fullName: string;
  registration: string;
  score: number | null;
  observations?: string;
}

export interface AssessmentGrades {
  hasGradesLaunched: boolean;
  students: StudentGrade[];
}

export type FinalStatus = "APPROVED" | "RECOVERY" | "FAILED" | "NO_GRADES";

export interface DisciplinePerformance {
  disciplineName: string;
  average: number | null;
  partialAverage: number | null;
  attendancePercent: number | null;
  finalStatus: FinalStatus;
  gradedAssessments: number;
  totalAssessments: number;
}

export interface StudentPerformance {
  studentId: string;
  fullName: string;
  registration: string;
  overallStatus: FinalStatus;
  disciplines: DisciplinePerformance[];
}

export interface StatusSummary {
  approved: number;
  recovery: number;
  failed: number;
  noGrades: number;
}

export interface ClassTermPerformance {
  data: StudentPerformance[];
  summary: StatusSummary & { byDiscipline: (StatusSummary & { disciplineName: string })[] };
}

export interface AcademicTermPeriod {
  term: number;
  startDate: string;
  endDate: string;
}

export interface AcademicCalendar {
  schoolYear: number;
  terms: AcademicTermPeriod[];
}

export type AttendanceStatus = "PRESENT" | "ABSENT" | "JUSTIFIED";

export interface AttendanceSummary {
  present: number;
  absent: number;
  justified: number;
}

export interface Lesson {
  id: string;
  classId: string;
  teacherId: string;
  teacherName?: string;
  disciplineName: string;
  date: string;
  lessonCount: number;
  academicTerm: number;
  topic?: string;
  attendance?: AttendanceSummary;
}

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface StudentAttendance {
  studentId: string;
  fullName: string;
  registration: string;
  isActive: boolean;
  status: AttendanceStatus | null;
  note?: string;
}

export interface LessonAttendance {
  lesson: Lesson;
  students: StudentAttendance[];
}
