import { byText } from "@/shared/format";
import type { Student } from "@/features/students/domain/models";
import type { AttendanceDraft, AttendanceRow, AttendanceStatus, LessonAttendance } from "./models";

export const ATTENDANCE_STATUSES: readonly AttendanceStatus[] = ["PRESENT", "ABSENT", "JUSTIFIED"];

export const LESSON_COUNT_LIMITS = { min: 1, max: 10 } as const;

export const isValidLessonCount = (count: number) =>
  Number.isInteger(count) && count >= LESSON_COUNT_LIMITS.min && count <= LESSON_COUNT_LIMITS.max;

const sortRows = (rows: AttendanceRow[]) => [...rows].sort(byText((row) => row.fullName));

export const draftFromLesson = ({ lesson, students }: LessonAttendance): AttendanceDraft => ({
  date: lesson.date,
  lessonCount: lesson.lessonCount,
  topic: lesson.topic ?? "",
  rows: sortRows(
    students.map((student) => ({
      studentId: student.studentId,
      fullName: student.fullName,
      status: student.status ?? "PRESENT",
    }))
  ),
});

export const draftFromStudents = (students: Student[], date: string): AttendanceDraft => ({
  date,
  lessonCount: 1,
  topic: "",
  rows: sortRows(
    students
      .filter((student) => student.isActive)
      .map((student) => ({ studentId: student.id, fullName: student.fullName, status: "PRESENT" as const }))
  ),
});

export const countByStatus = (statuses: Iterable<AttendanceStatus>) => {
  const counts: Record<AttendanceStatus, number> = { PRESENT: 0, ABSENT: 0, JUSTIFIED: 0 };
  for (const status of statuses) counts[status] += 1;
  return counts;
};
