import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { HttpError } from "@/core/domain/errors";
import { mockParams, mockRouter } from "@/test/expoRouterMock";
import { createTestDependencies, renderWithProviders } from "@/test/renderWithProviders";
import { NewStudentScreen } from "./NewStudentScreen";

jest.mock("expo-router", () => jest.requireActual("@/test/expoRouterMock").expoRouterMock());

describe("NewStudentScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams.current = { classId: "c1", className: "7A" };
  });

  it("cadastra o aluno na turma da tela, sem enviar campos opcionais vazios, e volta", async () => {
    const dependencies = createTestDependencies();
    (dependencies.studentRepository.create as jest.Mock).mockResolvedValue({ id: "s1" });
    await renderWithProviders(<NewStudentScreen />, dependencies);

    await fireEvent.changeText(screen.getByLabelText("Nome completo"), " Ana Souza ");
    await fireEvent.changeText(screen.getByLabelText("Matrícula"), "2026001");
    await fireEvent.changeText(screen.getByLabelText("E-mail"), "ana@escola.com");
    await fireEvent.press(screen.getByText("Cadastrar aluno"));

    await waitFor(() => expect(mockRouter.back).toHaveBeenCalled());
    expect(dependencies.studentRepository.create).toHaveBeenCalledWith({
      classId: "c1",
      fullName: "Ana Souza",
      registration: "2026001",
      email: "ana@escola.com",
    });
  });

  it("valida localmente e mostra o erro da API sem sair da tela", async () => {
    const dependencies = createTestDependencies();
    (dependencies.studentRepository.create as jest.Mock).mockRejectedValueOnce(
      new HttpError("Ja existe Aluno com esta matricula", 409)
    );
    await renderWithProviders(<NewStudentScreen />, dependencies);

    await fireEvent.press(screen.getByText("Cadastrar aluno"));
    expect(await screen.findByText("Informe o nome completo com ao menos 3 letras")).toBeTruthy();

    await fireEvent.changeText(screen.getByLabelText("Nome completo"), "Ana Souza");
    await fireEvent.changeText(screen.getByLabelText("Matrícula"), "2026001");
    await fireEvent.changeText(screen.getByLabelText("Data de nascimento (AAAA-MM-DD)"), "2014-02-30");
    await fireEvent.press(screen.getByText("Cadastrar aluno"));
    expect(await screen.findByText(/Data de nascimento inválida/)).toBeTruthy();
    expect(dependencies.studentRepository.create).not.toHaveBeenCalled();

    await fireEvent.changeText(screen.getByLabelText("Data de nascimento (AAAA-MM-DD)"), "2014-02-28");
    await fireEvent.press(screen.getByText("Cadastrar aluno"));
    expect(await screen.findByText(/Ja existe Aluno/)).toBeTruthy();
    expect(mockRouter.back).not.toHaveBeenCalled();
  });
});
