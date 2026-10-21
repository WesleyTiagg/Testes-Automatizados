import { fireEvent, render } from "@testing-library/react-native";
import { AlertCard } from "./AlertCard";

describe("AlertCard", () => {
  it("deve renderizar o alerta e chamar a exclusão ao clicar no botão", async () => {
    const onDelete = jest.fn();
    const alert = {
      id: "alert-1",
      cryptocurrency: "Bitcoin",
      symbol: "BTC",
      targetPrice: 60000,
      condition: "above" as const,
      createdAt: "2024-01-01T00:00:00.000Z",
    };

    const { getByText, getByLabelText } = await render(
      <AlertCard alert={alert} onDelete={onDelete} />,
    );

    expect(getByText("Bitcoin")).toBeTruthy();
    expect(getByText("$60,000.00")).toBeTruthy();

    await fireEvent.press(getByLabelText("Delete alert"));

    expect(onDelete).toHaveBeenCalledWith("alert-1");
  });
});
