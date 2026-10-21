import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import { AlertContext } from "@context/AlertProvider/useAlertProvider";
import { CreateAlertScreen } from "./CreateAlertScreen";

describe("CreateAlertScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar um alerta com criptomoeda, preço e condição válidos", async () => {
    const addAlert = jest.fn();

    const { getByText, getByPlaceholderText } = await render(
      <AlertContext.Provider
        value={{ alerts: [], addAlert, deleteAlert: jest.fn() }}
      >
        <CreateAlertScreen />
      </AlertContext.Provider>,
    );

    await fireEvent.press(getByText("Select cryptocurrency"));
    await fireEvent.press(getByText("Bitcoin"));
    await fireEvent.changeText(getByPlaceholderText("0.00"), "50000");
    await fireEvent.press(getByText("Save Alert"));

    expect(addAlert).toHaveBeenCalledWith({
      cryptocurrency: "Bitcoin",
      symbol: "BTC",
      targetPrice: 50000,
      condition: "above",
    });
    expect(router.replace).toHaveBeenCalledWith("/alerts");
  });
});
