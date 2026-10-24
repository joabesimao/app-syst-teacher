import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { mockParams, mockRouter } from "@/test/expoRouterMock";
import { createTestDependencies, renderWithProviders } from "@/test/renderWithProviders";
import { template } from "../../../test/fixtures";
import { EditTemplateScreen } from "./EditTemplateScreen";

jest.mock("expo-router", () => jest.requireActual("@/test/expoRouterMock").expoRouterMock());

const mine = { ...template, ownerTeacherId: "teacher-1" };

const setup = async (current = mine) => {
  mockParams.current = { templateId: "t1" };
  const dependencies = createTestDependencies();
  (dependencies.consolidationRepository.listTemplates as jest.Mock).mockResolvedValue([current]);
  (dependencies.consolidationRepository.updateTemplate as jest.Mock).mockResolvedValue(current);
  await renderWithProviders(<EditTemplateScreen />, dependencies);
  return dependencies;
};

describe("EditTemplateScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("edita itens e escala de um modelo ainda não aplicado", async () => {
    const dependencies = await setup();

    expect(await screen.findByDisplayValue("Quatro operações")).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText("Itens (um por linha)"), "Adição\nDivisão");
    await fireEvent.changeText(screen.getAllByLabelText("Rótulo")[0], "Certo");
    await fireEvent.press(screen.getByText("Salvar alterações"));

    await waitFor(() => expect(mockRouter.back).toHaveBeenCalled());
    expect(dependencies.consolidationRepository.updateTemplate).toHaveBeenCalledWith("t1", {
      name: "Quatro operações",
      description: null,
      items: [{ label: "Adição" }, { label: "Divisão" }],
      options: [
        { label: "Certo", summaryLabel: "Acertos", color: "#2E7D32", icon: "🟩", value: 1 },
        { label: "Errou", summaryLabel: "Erros", color: "#C62828", icon: "🟥", value: 0 },
      ],
    });
  });

  it("modelo em uso só altera nome e descrição", async () => {
    const dependencies = await setup({ ...mine, locked: true });

    await fireEvent.changeText(await screen.findByLabelText("Nome"), "Operações 7º ano");
    expect(screen.queryByLabelText("Itens (um por linha)")).toBeNull();
    expect(screen.queryByText("+ Adicionar opção")).toBeNull();
    expect(screen.getByText(/Duplique o modelo/)).toBeTruthy();
    await fireEvent.press(screen.getByText("Salvar alterações"));

    await waitFor(() =>
      expect(dependencies.consolidationRepository.updateTemplate).toHaveBeenCalledWith("t1", {
        name: "Operações 7º ano",
        description: null,
      })
    );
  });

  it("avisa quando o modelo não existe", async () => {
    mockParams.current = { templateId: "nao-existe" };
    const dependencies = createTestDependencies();
    (dependencies.consolidationRepository.listTemplates as jest.Mock).mockResolvedValue([mine]);
    await renderWithProviders(<EditTemplateScreen />, dependencies);
    expect(await screen.findByText("Modelo não encontrado.")).toBeTruthy();
  });
});
