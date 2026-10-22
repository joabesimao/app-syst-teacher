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
}

export interface StudentAttendance {
  studentId: string;
  fullName: string;
  status: AttendanceStatus | null;
}

export interface LessonAttendance {
  lesson: Lesson;
  students: StudentAttendance[];
}

export interface AttendanceRow {
  studentId: string;
  fullName: string;
  status: AttendanceStatus;
}

export interface AttendanceDraft {
  date: string;
  lessonCount: number;
  topic: string;
  rows: AttendanceRow[];
}

export interface LessonFilters {
  classId: string;
  disciplineName: string;
  teacherId?: string;
}

export interface NewLesson extends Omit<LessonFilters, "teacherId"> {
  teacherId: string;
  date: string;
  lessonCount: number;
  topic?: string;
  records: AttendanceRecord[];
}

export interface LessonChanges {
  date: string;
  lessonCount: number;
  topic?: string;
}
