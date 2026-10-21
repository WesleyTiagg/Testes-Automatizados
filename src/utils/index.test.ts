import { formatChange, formatPrice } from "./index";

describe("formatPrice", () => {
  it("deve formatar valores monetários com duas casas decimais", () => {
    expect(formatPrice(1234.5)).toBe("1,234.50");
  });

  it("deve manter zero com formatação padrão", () => {
    expect(formatPrice(0)).toBe("0.00");
  });

  it("deve respeitar o número de casas decimais informado", () => {
    expect(formatPrice(42.5, 0)).toBe("43");
  });
});

describe("formatChange", () => {
  it("deve incluir sinal positivo para variação acima de zero", () => {
    expect(formatChange(2.4)).toBe("+2.40%");
  });

  it("deve manter sinal negativo para variação abaixo de zero", () => {
    expect(formatChange(-1.25)).toBe("-1.25%");
  });
});
