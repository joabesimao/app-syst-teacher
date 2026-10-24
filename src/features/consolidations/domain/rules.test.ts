import { ValidationError } from "@/core/domain/errors";
import { makeSheet, right, template, wrong } from "../test/fixtures";
import { changedResponses, optionTag, templatesForDiscipline } from "./rules";
import { buildScale, draftFromTemplate, emptyOption, SCALE_COLORS, SCALE_PRESETS, scaleFromTemplate } from "./scale";
import { createConsolidation, createTemplate, parseItems, saveResponses, updateTemplate } from "./usecases";

const repository = () => ({
  consolidationRepository: {
    listTemplates: jest.fn(),
    createTemplate: jest.fn(),
    updateTemplate: jest.fn(),
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

  it("cria o modelo com a escala do rascunho", async () => {
    const deps = repository();
    const draft = { name: " Frações ", description: " ", items: "Soma\nProduto", scale: scaleFromTemplate(template) };
    await expect(createTemplate(deps, { ...draft, name: "ab" })).rejects.toThrow(/nome/);
    await expect(createTemplate(deps, { ...draft, items: " " })).rejects.toThrow(/item/);
    await createTemplate(deps, draft);
    expect(deps.consolidationRepository.createTemplate).toHaveBeenCalledWith({
      name: "Frações",
      description: null,
      items: [{ label: "Soma" }, { label: "Produto" }],
      options: [
        { label: "Acertou", summaryLabel: "Acertos", color: "#2E7D32", icon: "🟩", value: 1 },
        { label: "Errou", summaryLabel: "Erros", color: "#C62828", icon: "🟥", value: 0 },
      ],
    });
  });

  it("edita tudo no modelo livre e só nome/descrição no modelo em uso", async () => {
    const deps = repository();
    const draft = { ...draftFromTemplate(template), name: "Operações", description: "Diagnóstico" };
    await updateTemplate(deps, { template, draft });
    expect(deps.consolidationRepository.updateTemplate).toHaveBeenLastCalledWith(
      "t1",
      expect.objectContaining({ name: "Operações", items: [{ label: "Adição" }, { label: "Subtração" }] })
    );
    await updateTemplate(deps, { template: { ...template, locked: true }, draft: { ...draft, items: "" } });
    expect(deps.consolidationRepository.updateTemplate).toHaveBeenLastCalledWith("t1", {
      name: "Operações",
      description: "Diagnóstico",
    });
  });
});

describe("escala do modelo", () => {
  const scored = (values: string[]) => ({
    scored: true,
    options: values.map((value, index) => ({ ...emptyOption(index), label: `O${index}`, value })),
  });

  it("valida quantidade, rótulos e valores", () => {
    expect(() => buildScale({ scored: false, options: [{ ...emptyOption(0), label: "A" }] })).toThrow(/ao menos 2/);
    expect(() => buildScale({ scored: false, options: [emptyOption(0), emptyOption(1)] })).toThrow(/rótulo/);
    expect(() =>
      buildScale({ scored: false, options: [{ ...emptyOption(0), label: "Sim" }, { ...emptyOption(1), label: " sim " }] })
    ).toThrow(/repetidas/);
    expect(() => buildScale(scored(["1", ""]))).toThrow(/valor/);
    expect(() => buildScale(scored(["1", "-2"]))).toThrow(/valor/);
    expect(() => buildScale(scored(["0", "0"]))).toThrow(/mais que zero/);
  });

  it("converte o rascunho: vírgula decimal, opcionais vazios viram null e sem pontuação ignora valores", () => {
    expect(buildScale(scored(["0,5", "1"]))).toEqual([
      { label: "O0", summaryLabel: null, color: SCALE_COLORS[0], icon: null, value: 0.5 },
      { label: "O1", summaryLabel: null, color: SCALE_COLORS[1], icon: null, value: 1 },
    ]);
    expect(buildScale({ ...scored(["1", "x"]), scored: false }).map((option) => option.value)).toEqual([null, null]);
  });

  it("todos os presets são escalas válidas, exceto o 'Do zero' que pede rótulos", () => {
    for (const preset of SCALE_PRESETS.filter((item) => item.id !== "blank")) {
      expect(() => buildScale(preset.scale)).not.toThrow();
    }
  });

  it("monta o rascunho a partir de um modelo existente", () => {
    expect(draftFromTemplate({ ...template, options: [{ ...right, value: null }, wrong] }).scale.scored).toBe(false);
    expect(draftFromTemplate(template)).toMatchObject({
      name: "Quatro operações",
      items: "Adição\nSubtração",
      scale: { scored: true, options: [{ label: "Acertou", value: "1", icon: "🟩" }, { label: "Errou", value: "0" }] },
    });
  });
});
