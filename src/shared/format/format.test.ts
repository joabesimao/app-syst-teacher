import { byText, formatDate, formatNumber, formatSigned, isValidDay, plural, sameText, todayIso } from ".";

describe("format", () => {
  it("formata datas e números no padrão pt-BR", () => {
    expect(formatDate("2026-03-09T00:00:00.000Z")).toBe("09/03/2026");
    expect(todayIso(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(formatNumber(7.456)).toBe("7,46");
    expect(formatNumber(null)).toBe("-");
    expect(formatNumber(80, "%")).toBe("80%");
    expect(formatSigned(1.5)).toBe("+1,5");
  });

  it("compara textos ignorando caixa e espaços", () => {
    expect(sameText(" Matemática", "matemática ")).toBe(true);
    expect(["Bruno", "Ana", "Álvaro"].map((name) => ({ name })).sort(byText((item) => item.name))).toEqual([
      { name: "Álvaro" },
      { name: "Ana" },
      { name: "Bruno" },
    ]);
    expect(plural(1, "aula", "aulas")).toBe("1 aula");
    expect(plural(2, "aula", "aulas")).toBe("2 aulas");
  });
});

describe("isValidDay", () => {
  it.each([
    ["2026-03-09", true],
    ["2024-02-29", true],
    ["2026-02-30", false],
    ["2026-13-01", false],
    ["09/03/2026", false],
    ["2026-3-9", false],
  ])("%s → %s", (value, expected) => {
    expect(isValidDay(value)).toBe(expected);
  });
});
