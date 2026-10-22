import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { HttpError } from "@/core/domain/errors";
import { useSessionStore } from "@/features/auth/presentation/store/useSessionStore";
import { mockParams, mockRouter } from "@/test/expoRouterMock";
import { createTestDependencies, renderWithProviders } from "@/test/renderWithProviders";
import { NewAssessmentScreen } from "./NewAssessmentScreen";

jest.mock("expo-router", () => jest.requireActual("@/test/expoRouterMock").expoRouterMock());

describe("NewAssessmentScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams.current = { classId: "c1", discipline: "Matemática", className: "7A" };
    useSessionStore.getState().setSession({
      accessToken: "a",
      refreshToken: "r",
      user: { id: "u1", name: "Ana", email: "a@a.com", role: "TEACHER", teacherId: "t1" },
    });
  });

  it("cria a avaliação na turma e disciplina da tela e volta", async () => {
    const dependencies = createTestDependencies();
    (dependencies.assessmentRepository.create as jest.Mock).mockResolvedValue({ id: "a1" });
    await renderWithProviders(<NewAssessmentScreen />, dependencies);

    await fireEvent.changeText(screen.getByLabelText("Título"), "Prova 1");
    await fireEvent.changeText(screen.getByLabelText("Data de entrega (AAAA-MM-DD)"), "2026-10-22");
    await fireEvent.changeText(screen.getByLabelText("Peso"), "2");
    await fireEvent.press(screen.getByText("Planejada"));
    await fireEvent.press(screen.getByText("Criar avaliação"));

    await waitFor(() => expect(mockRouter.back).toHaveBeenCalled());
    expect(dependencies.assessmentRepository.create).toHaveBeenCalledWith({
      title: "Prova 1",
      classId: "c1",
      teacherId: "t1",
      disciplineName: "Matemática",
      maxScore: 10,
      weight: 2,
      dueDate: "2026-10-22",
      status: "PLANNED",
      kind: "REGULAR",
    });
  });

  it("esconde o peso na recuperação", async () => {
    await renderWithProviders(<NewAssessmentScreen />);

    expect(screen.getByLabelText("Peso")).toBeTruthy();
    await fireEvent.press(screen.getByText("Recuperação"));
    expect(screen.queryByLabelText("Peso")).toBeNull();
    expect(screen.getByText(/média do bimestre abaixo de 7/)).toBeTruthy();
  });

  it("mostra a validação local e o erro da API sem sair da tela", async () => {
    const dependencies = createTestDependencies();
    (dependencies.assessmentRepository.create as jest.Mock).mockRejectedValueOnce(
      new HttpError("Ja existe uma recuperacao de Matemática no 4o bimestre desta turma", 422)
    );
    await renderWithProviders(<NewAssessmentScreen />, dependencies);

    await fireEvent.press(screen.getByText("Criar avaliação"));
    expect(await screen.findByText("Informe um título com ao menos 3 letras")).toBeTruthy();
    expect(dependencies.assessmentRepository.create).not.toHaveBeenCalled();

    await fireEvent.changeText(screen.getByLabelText("Título"), "Recuperação");
    await fireEvent.press(screen.getByText("Criar avaliação"));
    expect(await screen.findByText(/Ja existe uma recuperacao/)).toBeTruthy();
    expect(mockRouter.back).not.toHaveBeenCalled();
  });
});
