import type {
  AcademicCalendar,
  AcademicTerm,
  AcademicTermPeriod,
  Assessment,
  AssessmentGrades,
  AssessmentStatus,
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
  ClassTermPerformance,
  Lesson,
  LessonAttendance,
  SchoolClass,
  SchoolShift,
  Student,
  CurrentTeacher,
  Teacher,
  TeacherAssignment,
} from "../types/domain";
import { request } from "./apiClient";

type ApiClass = {
  id: string;
  name: string;
  gradeLevel: string;
  schoolYear: number;
  shift?: string | null;
  isActive: boolean;
};

type ApiStudent = {
  id: string;
  classId: string;
  fullName: string;
  registration: string;
  birthDate?: string | null;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  isActive: boolean;
};

type ApiTeacherAssignment = {
  classId: string;
  disciplineName: string;
  workloadHours?: number | null;
};

type ApiTeacher = {
  id: string;
  fullName: string;
  email: string;
  cpf: string;
  isActive: boolean;
  assignments?: ApiTeacherAssignment[];
};

type ApiAssessment = {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  disciplineName: string;
  academicTerm: number;
  maxScore: number;
  weight: number;
  dueDate: string;
  status: AssessmentStatus;
};

type ApiGradeItem = {
  studentId: string;
  fullName: string;
  registration: string;
  evaluationNote: number | null;
  observations: string | null;
};

type ApiLesson = {
  id: string;
  classId: string;
  teacherId: string;
  disciplineName: string;
  date: string;
  lessonCount: number;
  academicTerm: number;
  topic: string | null;
  teacher?: { fullName: string };
  attendance?: AttendanceSummary;
};

type ApiLessonAttendance = {
  lesson: ApiLesson;
  students: {
    studentId: string;
    fullName: string;
    registration: string;
    isActive: boolean;
    status: AttendanceStatus | null;
    note: string | null;
  }[];
};

type Page<T> = { data: T[] };

const send = <T>(method: string, path: string, body?: unknown) =>
  request<T>(path, { method, body: body === undefined ? undefined : JSON.stringify(body) });

const query = (params: Record<string, string | number | boolean | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  return search.toString();
};

const emptyToUndefined = (value?: string) => (value && value.trim() ? value.trim() : undefined);

export async function checkHealth() {
  try {
    const result = await request<{ status: string }>("/health");
    return result?.status === "ok";
  } catch {
    return false;
  }
}

function mapClass(apiClass: ApiClass): SchoolClass {
  return {
    id: apiClass.id,
    name: apiClass.name,
    gradeLevel: apiClass.gradeLevel,
    schoolYear: apiClass.schoolYear,
    shift: (apiClass.shift as SchoolShift | null | undefined) ?? null,
    isActive: apiClass.isActive,
  };
}

function mapStudent(apiStudent: ApiStudent): Student {
  return {
    id: apiStudent.id,
    fullName: apiStudent.fullName,
    registration: apiStudent.registration,
    classId: apiStudent.classId,
    birthDate: apiStudent.birthDate?.slice(0, 10),
    cpf: apiStudent.cpf ?? undefined,
    email: apiStudent.email ?? undefined,
    phone: apiStudent.phone ?? undefined,
    isActive: apiStudent.isActive,
  };
}

function mapTeacher(apiTeacher: ApiTeacher): Teacher {
  return {
    id: apiTeacher.id,
    fullName: apiTeacher.fullName,
    email: apiTeacher.email,
    cpf: apiTeacher.cpf,
    isActive: apiTeacher.isActive,
    assignments: (apiTeacher.assignments ?? []).map((assignment) => ({
      classId: assignment.classId,
      disciplineName: assignment.disciplineName,
      workloadHours: assignment.workloadHours ?? undefined,
    })),
  };
}

function mapAssessment(apiAssessment: ApiAssessment): Assessment {
  return {
    id: apiAssessment.id,
    title: apiAssessment.title,
    classId: apiAssessment.classId,
    discipline: apiAssessment.disciplineName,
    teacherId: apiAssessment.teacherId,
    academicTerm: String(apiAssessment.academicTerm) as AcademicTerm,
    maxScore: apiAssessment.maxScore,
    weight: apiAssessment.weight,
    dueDate: apiAssessment.dueDate.slice(0, 10),
    status: apiAssessment.status,
  };
}

function mapLesson(apiLesson: ApiLesson): Lesson {
  return {
    id: apiLesson.id,
    classId: apiLesson.classId,
    teacherId: apiLesson.teacherId,
    teacherName: apiLesson.teacher?.fullName,
    disciplineName: apiLesson.disciplineName,
    date: apiLesson.date.slice(0, 10),
    lessonCount: apiLesson.lessonCount,
    academicTerm: apiLesson.academicTerm,
    topic: apiLesson.topic ?? undefined,
    attendance: apiLesson.attendance,
  };
}

function mapLessonAttendance(response: ApiLessonAttendance): LessonAttendance {
  return {
    lesson: mapLesson(response.lesson),
    students: response.students.map((student) => ({
      ...student,
      note: student.note ?? undefined,
    })),
  };
}

export type SchoolClassInput = {
  name: string;
  gradeLevel: string;
  schoolYear: number;
  shift?: SchoolShift;
  isActive?: boolean;
};

export async function loadClasses() {
  const response = await request<Page<ApiClass>>("/classes?limit=100");
  return response.data.map(mapClass);
}

export async function createClass(payload: SchoolClassInput) {
  return mapClass(await send<ApiClass>("POST", "/classes", payload));
}

export async function updateClass(id: string, payload: Partial<SchoolClassInput>) {
  return mapClass(await send<ApiClass>("PATCH", `/classes/${id}`, payload));
}

export async function deleteClass(id: string) {
  await send<{ message: string }>("DELETE", `/classes/${id}`);
}

export async function loadCalendar(schoolYear: number): Promise<AcademicCalendar> {
  const response = await request<AcademicCalendar>(`/calendars/${schoolYear}`);
  return {
    schoolYear: response.schoolYear,
    terms: response.terms.map((term) => ({
      term: term.term,
      startDate: term.startDate.slice(0, 10),
      endDate: term.endDate.slice(0, 10),
    })),
  };
}

export async function saveCalendar(schoolYear: number, terms: AcademicTermPeriod[]) {
  await send<AcademicCalendar>("PUT", `/calendars/${schoolYear}`, { terms });
  return loadCalendar(schoolYear);
}

export async function loadStudents(params: { classId?: string } = {}) {
  const response = await request<Page<ApiStudent>>(`/students?${query({ ...params, limit: 100 })}`);
  return response.data.map(mapStudent);
}

const toStudentBody = (payload: Partial<Omit<Student, "id">>) => ({
  fullName: payload.fullName,
  registration: payload.registration,
  classId: payload.classId,
  birthDate: emptyToUndefined(payload.birthDate),
  cpf: emptyToUndefined(payload.cpf),
  email: emptyToUndefined(payload.email),
  phone: emptyToUndefined(payload.phone),
  isActive: payload.isActive,
});

export async function createStudent(payload: Omit<Student, "id">) {
  return mapStudent(await send<ApiStudent>("POST", "/students", toStudentBody(payload)));
}

export async function updateStudent(id: string, payload: Partial<Omit<Student, "id">>) {
  return mapStudent(await send<ApiStudent>("PATCH", `/students/${id}`, toStudentBody(payload)));
}

export async function deleteStudent(id: string) {
  await send<{ message: string }>("DELETE", `/students/${id}`);
}

export async function loadTeachers() {
  const response = await request<Page<ApiTeacher>>("/teachers?limit=100");
  return response.data.map(mapTeacher);
}

const toAssignmentsBody = (assignments?: TeacherAssignment[]) =>
  assignments?.map((assignment) => ({
    classId: assignment.classId,
    disciplineName: assignment.disciplineName.trim(),
    workloadHours: assignment.workloadHours || undefined,
  }));

export type TeacherInput = Omit<Teacher, "id"> & { password?: string };

export async function createTeacher(payload: TeacherInput) {
  const created = await send<ApiTeacher>("POST", "/teachers", {
    fullName: payload.fullName,
    email: payload.email,
    cpf: payload.cpf,
    isActive: payload.isActive,
    password: emptyToUndefined(payload.password),
    assignments: toAssignmentsBody(payload.assignments),
  });
  return mapTeacher(created);
}

export async function updateTeacher(id: string, payload: Partial<Omit<Teacher, "id">>) {
  const updated = await send<ApiTeacher>("PATCH", `/teachers/${id}`, {
    fullName: payload.fullName,
    email: payload.email,
    cpf: payload.cpf,
    isActive: payload.isActive,
    assignments: toAssignmentsBody(payload.assignments),
  });
  return mapTeacher(updated);
}

type ApiCurrentTeacher = Omit<ApiTeacher, "assignments"> & {
  assignments: (ApiTeacherAssignment & { schoolClass: ApiClass })[];
};

export async function loadCurrentTeacher(): Promise<CurrentTeacher> {
  const response = await request<ApiCurrentTeacher>("/auth/me");
  return {
    ...mapTeacher(response),
    assignments: response.assignments.map((assignment) => ({
      classId: assignment.classId,
      disciplineName: assignment.disciplineName,
      workloadHours: assignment.workloadHours ?? undefined,
      schoolClass: mapClass(assignment.schoolClass),
    })),
  };
}

export async function deleteTeacher(id: string) {
  await send<{ message: string }>("DELETE", `/teachers/${id}`);
}

export type AssessmentInput = {
  title: string;
  classId: string;
  discipline: string;
  teacherId: string;
  academicTerm: AcademicTerm;
  maxScore: number;
  weight: number;
  dueDate: string;
  status?: AssessmentStatus;
};

const toAssessmentBody = (payload: Partial<AssessmentInput>) => ({
  title: payload.title,
  classId: payload.classId,
  teacherId: payload.teacherId,
  disciplineName: payload.discipline,
  academicTerm: payload.academicTerm ? Number(payload.academicTerm) : undefined,
  maxScore: payload.maxScore,
  weight: payload.weight,
  dueDate: payload.dueDate,
  status: payload.status,
});

export async function loadAssessments(params: { classId?: string; teacherId?: string } = {}) {
  const response = await request<Page<ApiAssessment>>(`/assessments?${query({ ...params, limit: 100 })}`);
  return response.data.map(mapAssessment);
}

export async function createAssessment(payload: AssessmentInput) {
  return mapAssessment(await send<ApiAssessment>("POST", "/assessments", toAssessmentBody(payload)));
}

export async function updateAssessment(id: string, payload: Partial<AssessmentInput>) {
  return mapAssessment(
    await send<ApiAssessment>("PATCH", `/assessments/${id}`, toAssessmentBody(payload))
  );
}

export async function deleteAssessment(id: string) {
  await send<{ message: string }>("DELETE", `/assessments/${id}`);
}

export async function loadAssessmentGrades(
  assessmentId: string,
  classId: string
): Promise<AssessmentGrades> {
  const response = await request<{ gradingInfo: { hasGradesLaunched: boolean }; data: ApiGradeItem[] }>(
    `/assessments/${assessmentId}/class/${classId}/students-grades`
  );
  return {
    hasGradesLaunched: response.gradingInfo.hasGradesLaunched,
    students: response.data.map((item) => ({
      studentId: item.studentId,
      fullName: item.fullName,
      registration: item.registration,
      score: item.evaluationNote,
      observations: item.observations ?? undefined,
    })),
  };
}

export async function saveAssessmentGrades(
  assessmentId: string,
  grades: { studentId: string; score: number; observations?: string }[]
) {
  await send<{ message: string }>("POST", `/assessments/${assessmentId}/grades`, {
    grades: grades.map((grade) => ({ ...grade, observations: emptyToUndefined(grade.observations) })),
  });
}

export async function loadPerformanceByClassTerm(classId: string, term: AcademicTerm) {
  return request<ClassTermPerformance>(`/classes/${classId}/term/${Number(term)}/performance`);
}

export async function loadLessons(params: {
  classId?: string;
  teacherId?: string;
  disciplineName?: string;
  term?: AcademicTerm;
}) {
  const response = await request<Page<ApiLesson>>(
    `/lessons?${query({ ...params, term: params.term ? Number(params.term) : undefined, limit: 100 })}`
  );
  return response.data.map(mapLesson);
}

export type LessonInput = {
  classId: string;
  teacherId: string;
  disciplineName: string;
  date: string;
  lessonCount: number;
  topic?: string;
  records: AttendanceRecord[];
};

const toRecordsBody = (records: AttendanceRecord[]) =>
  records.map((record) => ({ ...record, note: emptyToUndefined(record.note) }));

export async function createLesson(payload: LessonInput) {
  const created = await send<ApiLessonAttendance>("POST", "/lessons", {
    ...payload,
    topic: emptyToUndefined(payload.topic),
    records: toRecordsBody(payload.records),
  });
  return mapLessonAttendance(created);
}

export async function loadLessonAttendance(id: string) {
  return mapLessonAttendance(await request<ApiLessonAttendance>(`/lessons/${id}`));
}

export async function updateLesson(
  id: string,
  payload: { date?: string; lessonCount?: number; topic?: string }
) {
  return mapLesson(
    await send<ApiLesson>("PATCH", `/lessons/${id}`, { ...payload, topic: emptyToUndefined(payload.topic) })
  );
}

export async function saveLessonAttendance(id: string, records: AttendanceRecord[]) {
  return mapLessonAttendance(
    await send<ApiLessonAttendance>("PUT", `/lessons/${id}/attendance`, {
      records: toRecordsBody(records),
    })
  );
}

export async function deleteLesson(id: string) {
  await send<{ message: string }>("DELETE", `/lessons/${id}`);
}
