"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LineChart } from "lucide-react";

type CoinData = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
};

const coins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: "/btc-logo.svg" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: "/eth-logo.svg" },
  { id: "solana", name: "Solana", symbol: "SOL", icon: "/sol-logo.svg" },
];

export default function CryptoOverview() {
  const [data, setData] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/crypto");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Erro ao buscar preços das criptos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <LineChart className="w-6 h-6 text-yellow-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Cotações de Criptomoedas
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        {coins.map((coin) => {
          const coinData = data.find((c) => c.id === coin.id);
          const variation = coinData?.change ?? 0;
          const variationClass =
            variation > 0
              ? "text-green-700"
              : variation < 0
              ? "text-red-700"
              : "text-gray-700";

          const imageSizeClass =
            coin.id === "ethereum" ? "w-9 h-9" : "w-10 h-10";

          return (
            <div
              key={coin.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md px-5 py-4 w-full h-[125px]"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={coin.icon}
                  alt={coin.name}
                  width={40}
                  height={40}
                  className={`object-contain ${imageSizeClass}`}
                />
                <div>
                  <h3 className="text-md font-semibold text-gray-800">
                    {coin.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {`(${coin.symbol})`}
                  </p>
                </div>
              </div>

              {loading ? (
                <p className="text-sm text-gray-500">Carregando...</p>
              ) : coinData ? (
                <>
                  <p className="text-sm text-gray-700">
                    Valor atual:{" "}
                    <strong className="text-black">
                      R${" "}
                      {coinData.price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </p>
                  <p className={`text-sm font-semibold ${variationClass}`}>
                    Variação 24h: {variation >= 0 ? "+" : ""}
                    {variation.toFixed(2)}%
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
