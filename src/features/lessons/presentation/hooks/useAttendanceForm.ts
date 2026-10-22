import { useCallback, useMemo, useReducer } from "react";
import type { AttendanceDraft, AttendanceStatus } from "../../domain/models";
import { countByStatus } from "../../domain/rules";

export interface AttendanceFormState {
  date: string;
  lessonCount: number;
  topic: string;
  students: { studentId: string; fullName: string }[];
  statuses: Record<string, AttendanceStatus>;
}

type Action =
  | { type: "date"; value: string }
  | { type: "lessonCount"; value: number }
  | { type: "topic"; value: string }
  | { type: "status"; studentId: string; status: AttendanceStatus };

export const initAttendanceForm = (draft: AttendanceDraft): AttendanceFormState => ({
  date: draft.date,
  lessonCount: draft.lessonCount,
  topic: draft.topic,
  students: draft.rows.map(({ studentId, fullName }) => ({ studentId, fullName })),
  statuses: Object.fromEntries(draft.rows.map((row) => [row.studentId, row.status])),
});

export function attendanceFormReducer(state: AttendanceFormState, action: Action): AttendanceFormState {
  switch (action.type) {
    case "date":
      return { ...state, date: action.value };
    case "lessonCount":
      return { ...state, lessonCount: action.value };
    case "topic":
      return { ...state, topic: action.value };
    case "status":
      if (state.statuses[action.studentId] === action.status) return state;
      return { ...state, statuses: { ...state.statuses, [action.studentId]: action.status } };
  }
}

export const toAttendanceDraft = (state: AttendanceFormState): AttendanceDraft => ({
  date: state.date,
  lessonCount: state.lessonCount,
  topic: state.topic,
  rows: state.students.map((student) => ({ ...student, status: state.statuses[student.studentId] })),
});

export function useAttendanceForm(initial: AttendanceDraft) {
  const [state, dispatch] = useReducer(attendanceFormReducer, initial, initAttendanceForm);

  const setDate = useCallback((value: string) => dispatch({ type: "date", value }), []);
  const setLessonCount = useCallback((value: number) => dispatch({ type: "lessonCount", value }), []);
  const setTopic = useCallback((value: string) => dispatch({ type: "topic", value }), []);
  const setStatus = useCallback(
    (studentId: string, status: AttendanceStatus) => dispatch({ type: "status", studentId, status }),
    []
  );
  const counts = useMemo(() => countByStatus(Object.values(state.statuses)), [state.statuses]);

  return { state, counts, setDate, setLessonCount, setTopic, setStatus };
}
