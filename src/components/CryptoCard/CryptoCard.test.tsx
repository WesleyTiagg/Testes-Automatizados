import { fireEvent, render } from "@testing-library/react-native";
import { AlertContext } from "@context/AlertProvider/useAlertProvider";
import { CryptoCard } from "./CryptoCard";

const baseCrypto = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "BTC",
  price: 67999.5,
  change24h: 2.45,
  image: "https://example.com/bitcoin.png",
};

describe("CryptoCard", () => {
  it("deve renderizar os dados principais da criptomoeda", async () => {
    const { getByText } = await render(
      <AlertContext.Provider
        value={{ alerts: [], addAlert: jest.fn(), deleteAlert: jest.fn() }}
      >
        <CryptoCard crypto={baseCrypto} />
      </AlertContext.Provider>,
    );

    expect(getByText("Bitcoin")).toBeTruthy();
    expect(getByText("BTC")).toBeTruthy();
    expect(getByText("$67,999.50")).toBeTruthy();
    expect(getByText("+2.45%")).toBeTruthy();
  });

  it("deve expandir a lista de alertas quando o cartão possui alertas ativos", async () => {
    const alerts = [
      {
        id: "alert-1",
        cryptocurrency: "Bitcoin",
        symbol: "BTC",
        targetPrice: 65000,
        condition: "above" as const,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "alert-2",
        cryptocurrency: "Bitcoin",
        symbol: "BTC",
        targetPrice: 70000,
        condition: "below" as const,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];

    const { getByLabelText, getByText, queryByText } = await render(
      <AlertContext.Provider
        value={{ alerts, addAlert: jest.fn(), deleteAlert: jest.fn() }}
      >
        <CryptoCard crypto={baseCrypto} />
      </AlertContext.Provider>,
    );

    expect(getByLabelText("Toggle alerts for this cryptocurrency")).toBeTruthy();
    expect(queryByText("Above target")).toBeNull();

    await fireEvent.press(getByLabelText("Toggle alerts for this cryptocurrency"));

    expect(getByText("Above target")).toBeTruthy();
    expect(getByText("Below target")).toBeTruthy();
  });
});
