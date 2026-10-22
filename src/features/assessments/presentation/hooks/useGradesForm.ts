import { useCallback, useReducer } from "react";
import { byText } from "@/shared/format";
import type { AssessmentGrades, GradeEntry } from "../../domain/models";
import { scoreToInput } from "../../domain/rules";

export interface GradesFormState {
  students: { studentId: string; fullName: string; registration: string }[];
  scores: Record<string, string>;
}

type Action = { type: "score"; studentId: string; value: string };

export const initGradesForm = (grades: AssessmentGrades): GradesFormState => {
  const students = [...grades.students].sort(byText((student) => student.fullName));
  return {
    students: students.map(({ studentId, fullName, registration }) => ({ studentId, fullName, registration })),
    scores: Object.fromEntries(students.map((student) => [student.studentId, scoreToInput(student.score)])),
  };
};

export const gradesFormReducer = (state: GradesFormState, action: Action): GradesFormState =>
  state.scores[action.studentId] === action.value
    ? state
    : { ...state, scores: { ...state.scores, [action.studentId]: action.value } };

export const toGradeEntries = (state: GradesFormState): GradeEntry[] =>
  state.students.map(({ studentId, fullName }) => ({ studentId, fullName, score: state.scores[studentId] ?? "" }));

export function useGradesForm(grades: AssessmentGrades) {
  const [state, dispatch] = useReducer(gradesFormReducer, grades, initGradesForm);
  const setScore = useCallback((studentId: string, value: string) => dispatch({ type: "score", studentId, value }), []);
  return { state, setScore };
}
