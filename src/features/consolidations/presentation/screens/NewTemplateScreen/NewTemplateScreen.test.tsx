import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { mockRouter } from "@/test/expoRouterMock";
import { createTestDependencies, renderWithProviders } from "@/test/renderWithProviders";
import { SCALE_COLORS } from "../../../domain/scale";
import { template } from "../../../test/fixtures";
import { NewTemplateScreen } from "./NewTemplateScreen";

jest.mock("expo-router", () => jest.requireActual("@/test/expoRouterMock").expoRouterMock());

const setup = async () => {
  const dependencies = createTestDependencies();
  (dependencies.consolidationRepository.listTemplates as jest.Mock).mockResolvedValue([template]);
  (dependencies.consolidationRepository.createTemplate as jest.Mock).mockResolvedValue(template);
  await renderWithProviders(<NewTemplateScreen />, dependencies);
  await fireEvent.changeText(await screen.findByLabelText("Nome"), "Frações");
  await fireEvent.changeText(screen.getByLabelText("Itens (um por linha)"), "Soma\nProduto");
  return dependencies;
};

describe("NewTemplateScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("parte de uma escala pronta, permite editar e adicionar opções", async () => {
    const dependencies = await setup();

    await fireEvent.press(screen.getByText("Sim / Não"));
    await fireEvent.changeText(screen.getAllByLabelText("Rótulo")[1], "Ainda não");
    await fireEvent.press(screen.getByText("+ Adicionar opção"));
    await fireEvent.changeText(screen.getAllByLabelText("Rótulo")[2], "Em parte");
    await fireEvent.changeText(screen.getAllByLabelText("Valor")[2], "0,5");
    await fireEvent.press(screen.getByText("Criar modelo"));

    await waitFor(() => expect(mockRouter.back).toHaveBeenCalled());
    expect(dependencies.consolidationRepository.createTemplate).toHaveBeenCalledWith({
      name: "Frações",
      description: null,
      items: [{ label: "Soma" }, { label: "Produto" }],
      options: [
        { label: "Sim", summaryLabel: null, color: "#2E7D32", icon: "✅", value: 1 },
        { label: "Ainda não", summaryLabel: null, color: "#C62828", icon: "❌", value: 0 },
        { label: "Em parte", summaryLabel: null, color: SCALE_COLORS[2], icon: null, value: 0.5 },
      ],
    });
  });

  it("copia a escala de um modelo e mostra o erro de validação da escala", async () => {
    const dependencies = await setup();

    await fireEvent.press(screen.getByText("Quatro operações"));
    expect(screen.getAllByLabelText("Rótulo").map((field) => field.props.value)).toEqual(["Acertou", "Errou"]);
    await fireEvent.press(screen.getByText("Do zero"));
    await fireEvent.press(screen.getByText("Criar modelo"));

    expect(await screen.findByText("Preencha o rótulo de todas as opções")).toBeTruthy();
    expect(dependencies.consolidationRepository.createTemplate).not.toHaveBeenCalled();
  });
});
