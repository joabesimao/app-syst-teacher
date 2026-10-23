import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { mockParams, mockRouter } from "@/test/expoRouterMock";
import { createTestDependencies, renderWithProviders } from "@/test/renderWithProviders";
import { template } from "../../../test/fixtures";
import { NewConsolidationScreen } from "./NewConsolidationScreen";

jest.mock("expo-router", () => jest.requireActual("@/test/expoRouterMock").expoRouterMock());

describe("NewConsolidationScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("aplica o modelo escolhido na turma e abre a tabela", async () => {
    mockParams.current = { classId: "class-1", discipline: "Matematica", className: "7A" };
    const dependencies = createTestDependencies();
    (dependencies.consolidationRepository.listTemplates as jest.Mock).mockResolvedValue([
      template,
      { ...template, id: "t9", name: "História oral", disciplineName: "Historia" },
    ]);
    (dependencies.consolidationRepository.create as jest.Mock).mockResolvedValue({ id: "c1" });
    await renderWithProviders(<NewConsolidationScreen />, dependencies);

    await fireEvent.press(await screen.findByText("Quatro operações"));
    expect(screen.queryByText("História oral")).toBeNull();
    expect(screen.getByText(/Adição, Subtração/)).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText("Data (AAAA-MM-DD)"), "2026-03-10");
    await fireEvent.press(screen.getByText("Criar e abrir tabela"));

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith({ pathname: "/consolidacao", params: { consolidationId: "c1" } })
    );
    expect(dependencies.consolidationRepository.create).toHaveBeenCalledWith({
      templateId: "t1",
      classId: "class-1",
      disciplineName: "Matematica",
      date: "2026-03-10",
      title: null,
    });
  });
});
