import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { mockParams, mockRouter } from "@/test/expoRouterMock";
import { createTestDependencies, renderWithProviders } from "@/test/renderWithProviders";
import { makeSheet } from "../../../test/fixtures";
import { LaunchResponsesScreen } from "./LaunchResponsesScreen";

jest.mock("expo-router", () => jest.requireActual("@/test/expoRouterMock").expoRouterMock());

const setup = async (studentId: string) => {
  mockParams.current = { consolidationId: "c1", studentId };
  const dependencies = createTestDependencies();
  (dependencies.consolidationRepository.loadSheet as jest.Mock).mockResolvedValue(makeSheet());
  await renderWithProviders(<LaunchResponsesScreen />, dependencies);
  await screen.findByText(/Aluno \d de 2/);
  return dependencies;
};

describe("LaunchResponsesScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("salva só as mudanças e vai para o próximo aluno", async () => {
    const dependencies = await setup("s1");

    await fireEvent.press(screen.getByLabelText("Subtração: Acertou"));
    await fireEvent.press(screen.getByLabelText("Adição: Acertou"));
    await fireEvent.press(screen.getByText("Salvar e próximo aluno"));

    await waitFor(() => expect(mockRouter.setParams).toHaveBeenCalledWith({ studentId: "s2" }));
    expect(dependencies.consolidationRepository.saveResponses).toHaveBeenCalledWith("c1", [
      { studentId: "s1", itemId: "i1", optionId: null },
      { studentId: "s1", itemId: "i2", optionId: "o1" },
    ]);
  });

  it("no último aluno salva e volta para a tabela", async () => {
    const dependencies = await setup("s2");

    await fireEvent.press(screen.getByLabelText("Adição: Errou"));
    await fireEvent.press(screen.getByText("Salvar e voltar à tabela"));

    await waitFor(() => expect(mockRouter.back).toHaveBeenCalled());
    expect(dependencies.consolidationRepository.saveResponses).toHaveBeenCalledWith("c1", [
      { studentId: "s2", itemId: "i1", optionId: "o2" },
    ]);
  });
});
