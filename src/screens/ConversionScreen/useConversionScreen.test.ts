import { act, renderHook } from "@testing-library/react-native";
import { useConversionScreen } from "./useConversionScreen";

jest.mock("@data/cryptoData", () => {
  const actual = jest.requireActual("@data/cryptoData");
  return {
    ...actual,
    fetchCryptocurrenciesFromApi: jest.fn().mockResolvedValue(actual.cryptocurrencies),
  };
});

describe("useConversionScreen", () => {
  it("deve manter o resultado nulo quando o valor informado é inválido", async () => {
    const { result } = await renderHook(() => useConversionScreen());

    await act(async () => {
      result.current.setAmount("0");
    });

    expect(result.current.formattedResult).toBeNull();
    expect(result.current.showInvalid).toBe(true);
  });

  it("deve converter o valor para USD quando a moeda é válida", async () => {
    const { result } = await renderHook(() => useConversionScreen());

    await act(async () => {
      result.current.setAmount("2");
      result.current.setSelectedFiat("USD");
    });

    const expected = `$${(2 * 67999.5).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    expect(result.current.formattedResult).toBe(expected);
  });

  it("deve converter para outra moeda fiduciária com taxa aplicada", async () => {
    const { result } = await renderHook(() => useConversionScreen());

    await act(async () => {
      result.current.setAmount("2");
      result.current.setSelectedFiat("BRL");
    });

    const expected = `R$${(2 * 67999.5 * 5.12).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    expect(result.current.formattedResult).toBe(expected);
  });
});
