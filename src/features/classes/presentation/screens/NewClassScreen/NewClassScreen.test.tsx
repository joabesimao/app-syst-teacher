import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { HttpError } from "@/core/domain/errors";
import type { UserRole } from "@/core/session/types";
import { useSessionStore } from "@/features/auth/presentation/store/useSessionStore";
import { mockRouter } from "@/test/expoRouterMock";
import { createTestDependencies, renderWithProviders } from "@/test/renderWithProviders";
import { NewClassScreen } from "./NewClassScreen";

jest.mock("expo-router", () => jest.requireActual("@/test/expoRouterMock").expoRouterMock());

const signIn = (role: UserRole, teacherId: string | null) =>
  useSessionStore.getState().setSession({
    accessToken: "a",
    refreshToken: "r",
    user: { id: "u1", name: "Ana", email: "a@a.com", role, teacherId },
  });

describe("NewClassScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("professor cadastra a turma já vinculada à sua disciplina e volta", async () => {
    signIn("TEACHER", "t1");
    const dependencies = createTestDependencies();
    (dependencies.classRepository.create as jest.Mock).mockResolvedValue({ id: "c1" });
    await renderWithProviders(<NewClassScreen />, dependencies);

    await fireEvent.changeText(screen.getByLabelText("Nome da turma"), " 7A ");
    await fireEvent.changeText(screen.getByLabelText("Série/ano"), "7º ano");
    await fireEvent.changeText(screen.getByLabelText("Ano letivo"), "2026");
    await fireEvent.press(screen.getByText("Tarde"));
    await fireEvent.changeText(screen.getByLabelText("Disciplina que você leciona"), "Matemática");
    await fireEvent.press(screen.getByText("Cadastrar turma"));

    await waitFor(() => expect(mockRouter.back).toHaveBeenCalled());
    expect(dependencies.classRepository.create).toHaveBeenCalledWith({
      name: "7A",
      gradeLevel: "7º ano",
      schoolYear: 2026,
      shift: "AFTERNOON",
      disciplineName: "Matemática",
    });
  });

  it("exige a disciplina do professor e mostra o erro da API", async () => {
    signIn("TEACHER", "t1");
    const dependencies = createTestDependencies();
    (dependencies.classRepository.create as jest.Mock).mockRejectedValueOnce(
      new HttpError("Ja existe Turma com este nome e ano letivo", 409)
    );
    await renderWithProviders(<NewClassScreen />, dependencies);

    await fireEvent.changeText(screen.getByLabelText("Nome da turma"), "7A");
    await fireEvent.changeText(screen.getByLabelText("Série/ano"), "7º ano");
    await fireEvent.press(screen.getByText("Cadastrar turma"));
    expect(await screen.findByText("Informe a disciplina que você leciona nesta turma")).toBeTruthy();
    expect(dependencies.classRepository.create).not.toHaveBeenCalled();

    await fireEvent.changeText(screen.getByLabelText("Disciplina que você leciona"), "Matemática");
    await fireEvent.press(screen.getByText("Cadastrar turma"));
    expect(await screen.findByText(/Ja existe Turma/)).toBeTruthy();
    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it("admin sem vínculo com professor cadastra sem disciplina", async () => {
    signIn("ADMIN", null);
    const dependencies = createTestDependencies();
    (dependencies.classRepository.create as jest.Mock).mockResolvedValue({ id: "c1" });
    await renderWithProviders(<NewClassScreen />, dependencies);

    expect(screen.queryByLabelText(/Disciplina/)).toBeNull();
    await fireEvent.changeText(screen.getByLabelText("Nome da turma"), "9C");
    await fireEvent.changeText(screen.getByLabelText("Série/ano"), "9º ano");
    await fireEvent.press(screen.getByText("Cadastrar turma"));

    await waitFor(() => expect(mockRouter.back).toHaveBeenCalled());
    expect(dependencies.classRepository.create).toHaveBeenCalledWith({
      name: "9C",
      gradeLevel: "9º ano",
      schoolYear: new Date().getFullYear(),
    });
  });
});
