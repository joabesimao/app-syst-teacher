import { ValidationError } from "@/core/domain/errors";
import { makeSheet, right, template } from "../test/fixtures";
import { changedResponses, optionTag, templatesForDiscipline } from "./rules";
import { createConsolidation, createTemplate, parseItems, saveResponses } from "./usecases";

const repository = () => ({
  consolidationRepository: {
    listTemplates: jest.fn(),
    createTemplate: jest.fn(),
    duplicateTemplate: jest.fn(),
    deleteTemplate: jest.fn(),
    list: jest.fn(),
    create: jest.fn(),
    loadSheet: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
    saveResponses: jest.fn(),
    listByStudent: jest.fn(),
  },
});

describe("regras de consolidação", () => {
  it("mostra o ícone só no modo ícones e quando existe", () => {
    expect(optionTag(right, "text")).toBe("Acertou");
    expect(optionTag(right, "icon")).toBe("🟩");
    expect(optionTag({ ...right, icon: null }, "icon")).toBe("Acertou");
  });

  it("filtra modelos ativos da disciplina ou sem disciplina", () => {
    const general = { ...template, id: "t2", disciplineName: null };
    const inactive = { ...template, id: "t3", isActive: false };
    const other = { ...template, id: "t4", disciplineName: "Historia" };
    expect(templatesForDiscipline([template, general, inactive, other], "matematica").map((t) => t.id)).toEqual([
      "t1",
      "t2",
    ]);
  });

  it("envia só as células alteradas, inclusive as limpas", () => {
    const { students } = makeSheet();
    expect(
      changedResponses(students, { s1: { i1: "o1", i2: null }, s2: { i1: "o2", i2: null } })
    ).toEqual([
      { studentId: "s1", itemId: "i2", optionId: null },
      { studentId: "s2", itemId: "i1", optionId: "o2" },
    ]);
  });

  it("separa itens por linha sem repetir", () => {
    expect(parseItems(" Adição \n\nsubtração\nadição\nSubtração ")).toEqual(["Adição", "subtração"]);
  });
});

describe("casos de uso de consolidação", () => {
  it("valida o modelo e a data antes de criar", async () => {
    const deps = repository();
    const input = { classId: "c", disciplineName: "Matematica", templateId: null, date: "2026-03-10", title: "" };
    await expect(createConsolidation(deps, input)).rejects.toThrow("Escolha um modelo de consolidação");
    await expect(createConsolidation(deps, { ...input, templateId: "t1", date: "10/03" })).rejects.toThrow(
      ValidationError
    );
    await createConsolidation(deps, { ...input, templateId: "t1", title: "  " });
    expect(deps.consolidationRepository.create).toHaveBeenCalledWith({
      templateId: "t1",
      classId: "c",
      disciplineName: "Matematica",
      date: "2026-03-10",
      title: null,
    });
  });

  it("não salva respostas de consolidação concluída nem envia lista vazia", async () => {
    const deps = repository();
    await expect(
      saveResponses(deps, { consolidationId: "c1", status: "COMPLETED", responses: [] })
    ).rejects.toThrow(/Reabra/);
    await saveResponses(deps, { consolidationId: "c1", status: "IN_PROGRESS", responses: [] });
    expect(deps.consolidationRepository.saveResponses).not.toHaveBeenCalled();
  });

  it("cria o modelo copiando a escala do modelo base", async () => {
    const deps = repository();
    await expect(createTemplate(deps, { name: "ab", items: "x", base: template })).rejects.toThrow(/nome/);
    await expect(createTemplate(deps, { name: "Frações", items: " ", base: template })).rejects.toThrow(/item/);
    await expect(createTemplate(deps, { name: "Frações", items: "x", base: null })).rejects.toThrow(/escala/);
    await createTemplate(deps, { name: " Frações ", items: "Soma\nProduto", base: template });
    expect(deps.consolidationRepository.createTemplate).toHaveBeenCalledWith({
      name: "Frações",
      items: [{ label: "Soma" }, { label: "Produto" }],
      options: [
        { label: "Acertou", summaryLabel: "Acertos", color: "#2E7D32", icon: "🟩", value: 1 },
        { label: "Errou", summaryLabel: "Erros", color: "#C62828", icon: "🟥", value: 0 },
      ],
    });
  });
});
