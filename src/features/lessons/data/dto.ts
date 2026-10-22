import type { AttendanceStatus, AttendanceSummary } from "../domain/models";

export interface ApiLesson {
  id: string;
  classId: string;
  teacherId: string;
  disciplineName: string;
  date: string;
  lessonCount: number;
  academicTerm: number;
  topic: string | null;
  attendance?: AttendanceSummary;
}

export interface ApiLessonAttendance {
  lesson: ApiLesson;
  students: {
    studentId: string;
    fullName: string;
    status: AttendanceStatus | null;
  }[];
}
