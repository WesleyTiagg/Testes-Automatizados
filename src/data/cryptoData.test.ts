import {
  fetchCryptocurrenciesFromApi,
  type Cryptocurrency,
} from "./cryptoData";

describe("fetchCryptocurrenciesFromApi", () => {
  const mockResponse: Array<{
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h?: number | null;
    image: string;
  }> = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "btc",
      current_price: 66000,
      price_change_percentage_24h: 1.42,
      image: "https://example.com/bitcoin.png",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "eth",
      current_price: 3600,
      price_change_percentage_24h: null,
      image: "https://example.com/eth.png",
    },
  ];

  it("deve converter a resposta da API em dados de criptomoedas válidos", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchCryptocurrenciesFromApi();

    expect(result).toEqual([
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        price: 66000,
        change24h: 1.42,
        image: "https://example.com/bitcoin.png",
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        price: 3600,
        change24h: 0,
        image: "https://example.com/eth.png",
      },
    ] as Cryptocurrency[]);
  });

  it("deve lançar erro quando a API responde com falha", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(fetchCryptocurrenciesFromApi()).rejects.toThrow(
      "Failed to fetch cryptocurrencies: 500",
    );
  });
});
