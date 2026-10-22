import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useSessionStore } from "@/features/auth/presentation/store/useSessionStore";
import { mockParams, mockRouter } from "@/test/expoRouterMock";
import { createTestDependencies, renderWithProviders } from "@/test/renderWithProviders";
import { AttendanceScreen } from "./AttendanceScreen";

jest.mock("expo-router", () => jest.requireActual("@/test/expoRouterMock").expoRouterMock());

const students = [
  { id: "2", fullName: "Bruno Lima", registration: "2", classId: "c1", isActive: true },
  { id: "1", fullName: "Ana Souza", registration: "1", classId: "c1", isActive: true },
  { id: "3", fullName: "Carla Inativa", registration: "3", classId: "c1", isActive: false },
];

describe("AttendanceScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams.current = { classId: "c1", discipline: "Matemática", className: "7A" };
    useSessionStore.getState().setSession({
      accessToken: "a",
      refreshToken: "r",
      user: { id: "u1", name: "Ana", email: "a@a.com", role: "TEACHER", teacherId: "t1" },
    });
  });

  it("registra uma nova chamada com a falta marcada", async () => {
    const dependencies = createTestDependencies();
    (dependencies.studentRepository.listAllByClass as jest.Mock).mockResolvedValue(students);
    await renderWithProviders(<AttendanceScreen />, dependencies);

    expect(await screen.findByText("Ana Souza")).toBeTruthy();
    expect(screen.queryByText("Carla Inativa")).toBeNull();
    expect(screen.getByText("Alunos (2)")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Bruno Lima: Falta"));
    expect(screen.getByText("1 P · 1 F · 0 J")).toBeTruthy();
    await fireEvent.press(screen.getByText("Registrar chamada"));

    await waitFor(() => expect(mockRouter.back).toHaveBeenCalled());
    expect(dependencies.lessonRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        classId: "c1",
        teacherId: "t1",
        disciplineName: "Matemática",
        lessonCount: 1,
        records: [
          { studentId: "1", status: "PRESENT" },
          { studentId: "2", status: "ABSENT" },
        ],
      })
    );
  });

  it("bloqueia data inválida", async () => {
    const dependencies = createTestDependencies();
    (dependencies.studentRepository.listAllByClass as jest.Mock).mockResolvedValue(students);
    await renderWithProviders(<AttendanceScreen />, dependencies);

    await fireEvent.changeText(await screen.findByLabelText("Data (AAAA-MM-DD)"), "2026-02-31");
    await fireEvent.press(screen.getByText("Registrar chamada"));

    expect(await screen.findByText("Data inválida. Use o formato AAAA-MM-DD")).toBeTruthy();
    expect(dependencies.lessonRepository.create).not.toHaveBeenCalled();
  });
});
