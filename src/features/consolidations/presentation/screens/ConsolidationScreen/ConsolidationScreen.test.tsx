import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { mockParams, mockRouter } from "@/test/expoRouterMock";
import { createTestDependencies, renderWithProviders } from "@/test/renderWithProviders";
import { makeSheet } from "../../../test/fixtures";
import { ConsolidationScreen } from "./ConsolidationScreen";

jest.mock("expo-router", () => jest.requireActual("@/test/expoRouterMock").expoRouterMock());

const setup = async (status: "IN_PROGRESS" | "COMPLETED") => {
  mockParams.current = { consolidationId: "c1" };
  const dependencies = createTestDependencies();
  (dependencies.consolidationRepository.loadSheet as jest.Mock).mockResolvedValue(makeSheet(status));
  await renderWithProviders(<ConsolidationScreen />, dependencies);
  await screen.findByText("1. Ana Souza");
  return dependencies;
};

describe("ConsolidationScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("mostra a tabela com resumo, rodapé e alterna texto e ícones", async () => {
    await setup("IN_PROGRESS");

    expect(screen.getByText("Total da turma")).toBeTruthy();
    expect(screen.getAllByText("Acertou").length).toBeGreaterThan(0);
    expect(screen.getAllByText("50%").length).toBeGreaterThan(0);
    expect(screen.getByText("2 de 4 respostas lançadas")).toBeTruthy();

    await fireEvent.press(screen.getByText("Ícones"));
    expect(screen.getByText("🟩")).toBeTruthy();
    expect(screen.getByText("🟥")).toBeTruthy();
  });

  it("abre o lançamento no primeiro aluno pendente e conclui", async () => {
    const dependencies = await setup("IN_PROGRESS");

    await fireEvent.press(screen.getByText("Lançar respostas"));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/lancar-consolidacao",
      params: { consolidationId: "c1", studentId: "s2" },
    });

    await fireEvent.press(screen.getByText("Concluir consolidação"));
    await waitFor(() => expect(dependencies.consolidationRepository.updateStatus).toHaveBeenCalledWith("c1", "COMPLETED"));
  });

  it("fica somente leitura quando concluída", async () => {
    await setup("COMPLETED");

    expect(screen.getByText(/Reabra para alterar/)).toBeTruthy();
    expect(screen.queryByText("Lançar respostas")).toBeNull();
    expect(screen.getByText("Reabrir consolidação")).toBeTruthy();
  });
});
