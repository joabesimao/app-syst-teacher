import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { mockParams, mockRouter } from "@/test/expoRouterMock";
import { createTestDependencies, renderWithProviders } from "@/test/renderWithProviders";
import { GradesScreen } from "./GradesScreen";

jest.mock("expo-router", () => jest.requireActual("@/test/expoRouterMock").expoRouterMock());

const grades = {
  hasGradesLaunched: false,
  students: [
    { studentId: "2", fullName: "Bruno Lima", registration: "2026002", score: null },
    { studentId: "1", fullName: "Ana Souza", registration: "2026001", score: 8.5 },
  ],
};

const setup = async (status: string) => {
  mockParams.current = { assessmentId: "a1", classId: "c1", title: "Prova 1", maxScore: "10", status };
  const dependencies = createTestDependencies();
  (dependencies.assessmentRepository.loadGrades as jest.Mock).mockResolvedValue(grades);
  await renderWithProviders(<GradesScreen />, dependencies);
  await screen.findByText("Ana Souza");
  return dependencies;
};

describe("GradesScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("carrega as notas formatadas e salva as válidas", async () => {
    const dependencies = await setup("IN_PROGRESS");

    expect(screen.getByLabelText("Nota de Ana Souza").props.value).toBe("8,5");
    await fireEvent.changeText(screen.getByLabelText("Nota de Bruno Lima"), "7,25");
    await fireEvent.press(screen.getByText("Salvar notas"));

    await waitFor(() => expect(mockRouter.back).toHaveBeenCalled());
    expect(dependencies.assessmentRepository.saveGrades).toHaveBeenCalledWith("a1", [
      { studentId: "1", score: 8.5 },
      { studentId: "2", score: 7.25 },
    ]);
  });

  it("bloqueia nota acima da máxima", async () => {
    const dependencies = await setup("IN_PROGRESS");

    await fireEvent.changeText(screen.getByLabelText("Nota de Bruno Lima"), "11");
    await fireEvent.press(screen.getByText("Salvar notas"));

    expect(await screen.findByText("Nota inválida para Bruno Lima. Use um valor entre 0 e 10")).toBeTruthy();
    expect(dependencies.assessmentRepository.saveGrades).not.toHaveBeenCalled();
  });

  it("fica somente leitura fora de andamento", async () => {
    await setup("COMPLETED");

    expect(screen.getByText(/só podem ser lançadas com a avaliação Em andamento/)).toBeTruthy();
    expect(screen.queryByText("Salvar notas")).toBeNull();
    expect(screen.getByLabelText("Nota de Ana Souza").props.editable).toBe(false);
  });
});
