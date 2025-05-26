"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { API_BASE_URL } from "../../utils/api";

const stocks = [
  {
    symbol: "PETR4.SA",
    name: "Petrobras",
    logo: "/petrobras.png",
  },
  {
    symbol: "VALE3.SA",
    name: "Vale",
    logo: "/vale.png",
  },
  {
    symbol: "ITUB4.SA",
    name: "Itaú Unibanco",
    logo: "/itau.png",
  },
  {
    symbol: "BBDC4.SA",
    name: "Bradesco",
    logo: "/bradesco.png",
  },
];

type StockInfo = {
  symbol: string;
  price: number;
  changePercent: number;
};

export default function TopStocksCard() {
  const [data, setData] = useState<StockInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stocks`);

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Erro ao buscar ações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        📊 Ações Mais Negociadas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        {stocks.map((stock) => {
          const stockInfo = data.find((d) => d.symbol === stock.symbol);
          const isPositive = (stockInfo?.changePercent ?? 0) >= 0;

          return (
            <div
              key={stock.symbol}
              className="bg-white border border-gray-200 rounded-lg shadow-md px-5 py-4 w-full h-[125px]"
            >
              <div className="flex gap-2">
                <div className="flex justify-center mb-2">
                  <Image
                    src={stock.logo}
                    alt={stock.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-800">
                    {stock.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{stock.symbol}</p>
                </div>
              </div>

              {loading ? (
                <p className="text-sm text-gray-500">Carregando...</p>
              ) : stockInfo ? (
                <>
                  <p className="text-sm text-gray-700">
                    Valor atual:{" "}
                    <strong className="text-black">
                      R${" "}
                      {stockInfo.price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Variação 24h: {isPositive ? "+" : ""}
                    {stockInfo.changePercent.toFixed(2)}%
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">Dados indisponíveis</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
