import React from "react";
import { act, renderHook } from "@testing-library/react-native";
import { router } from "expo-router";
import { AlertContext } from "@context/AlertProvider/useAlertProvider";
import { useCreateAlertScreen } from "./useCreateAlertScreen";

describe("useCreateAlertScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      AlertContext.Provider,
      {
        value: {
          alerts: [],
          addAlert: jest.fn(),
          deleteAlert: jest.fn(),
        },
      },
      children,
    );

  it("deve validar preço inválido e manter erros visíveis", async () => {
    const { result } = await renderHook(() => useCreateAlertScreen(), { wrapper });

    await act(async () => {
      result.current.setSelectedCrypto("bitcoin");
    });

    await act(async () => {
      result.current.setTargetPrice("0");
    });

    await act(async () => {
      result.current.handleSave();
    });

    expect(result.current.errors.price).toBe("Please enter a valid price");
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("deve salvar alerta válido e redirecionar para a tela de alertas", async () => {
    const { result } = await renderHook(() => useCreateAlertScreen(), { wrapper });

    await act(async () => {
      result.current.setSelectedCrypto("bitcoin");
    });

    await act(async () => {
      result.current.setTargetPrice("50000");
    });

    await act(async () => {
      result.current.setCondition("above");
    });

    await act(async () => {
      result.current.handleSave();
    });

    expect(result.current.isFormValid).toBe(true);
    expect(router.replace).toHaveBeenCalledWith("/alerts");
  });
});
