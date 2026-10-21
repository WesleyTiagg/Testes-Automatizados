import { act, renderHook, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAlertProviderState } from "./useAlertProvider";

describe("useAlertProviderState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve carregar alertas persistidos e adicionar um novo alerta", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify([
        {
          id: "stored-1",
          cryptocurrency: "Bitcoin",
          symbol: "BTC",
          targetPrice: 50000,
          condition: "above",
          createdAt: "2024-01-01T00:00:00.000Z",
        },
      ]),
    );

    const { result } = await renderHook(() => useAlertProviderState());

    await waitFor(() => {
      expect(result.current.alerts).toHaveLength(1);
    });

    await act(async () => {
      result.current.addAlert({
        cryptocurrency: "Ethereum",
        symbol: "ETH",
        targetPrice: 3000,
        condition: "below",
      });
    });

    await waitFor(() => {
      expect(result.current.alerts).toHaveLength(2);
    });

    expect(result.current.alerts[1]).toMatchObject({
      cryptocurrency: "Ethereum",
      symbol: "ETH",
      targetPrice: 3000,
      condition: "below",
    });
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it("deve remover um alerta pelo id", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify([
        {
          id: "alert-1",
          cryptocurrency: "Bitcoin",
          symbol: "BTC",
          targetPrice: 60000,
          condition: "above",
          createdAt: "2024-01-01T00:00:00.000Z",
        },
      ]),
    );

    const { result } = await renderHook(() => useAlertProviderState());

    await waitFor(() => {
      expect(result.current.alerts).toHaveLength(1);
    });

    await act(async () => {
      result.current.deleteAlert("alert-1");
    });

    await waitFor(() => {
      expect(result.current.alerts).toHaveLength(0);
    });
  });
});
