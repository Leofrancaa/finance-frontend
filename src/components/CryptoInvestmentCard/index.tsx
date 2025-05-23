"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart } from "lucide-react";
import CryptoCard from "@/components/CryptoCard";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  quantity: number;
  invested: number;
};

const portfolio: Coin[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "/btc-logo.svg",
    quantity: 0.05,
    invested: 15000,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: "/eth-logo.svg",
    quantity: 1.2,
    invested: 9000,
  },
];

export default function CryptoInvestmentCard() {
  const [prices, setPrices] = useState<
    Record<string, { brl: number; brl_24h_change: number }>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = portfolio.map((c) => c.id).join(",");
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl&include_24hr_change=true`;
        const res = await axios.get(url);
        setPrices(res.data);
      } catch (err) {
        console.error("Erro ao buscar preços:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const enriched = portfolio.map((coin) => {
    const price = prices[coin.id]?.brl ?? 0;
    const variation = prices[coin.id]?.brl_24h_change ?? 0;
    const currentValue = price * coin.quantity;
    const profit = currentValue - coin.invested;
    const profitPercent = (profit / coin.invested) * 100 || 0;
    return {
      ...coin,
      currentPrice: price,
      variation,
      currentValue,
      profit,
      profitPercent,
    };
  });

  const totalInvested = enriched.reduce((acc, c) => acc + c.invested, 0);
  const totalCurrent = enriched.reduce((acc, c) => acc + c.currentValue, 0);
  const totalProfit = totalCurrent - totalInvested;
  const totalProfitPercent = (totalProfit / totalInvested) * 100 || 0;
  const avgVariation =
    enriched.reduce((sum, c) => sum + c.variation, 0) / enriched.length;

  const best = enriched.reduce((max, c) =>
    c.variation > max.variation ? c : max
  );

  return (
    <section className="w-[62.5vw] bg-white shadow-lg rounded-lg p-6 border border-gray-200 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <LineChart className="w-8 h-8 text-yellow-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Investimentos em Cripto
        </h2>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Carregando dados...</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Lado esquerdo: cards */}
          <div className="flex flex-wrap gap-4 justify-center">
            {enriched.map((coin) => (
              <CryptoCard
                key={coin.id}
                name={coin.name}
                symbol={coin.symbol}
                icon={coin.icon}
                quantity={coin.quantity}
                invested={coin.invested}
                currentPrice={coin.currentPrice}
                variation24h={coin.variation}
              />
            ))}
          </div>

          {/* Lado direito: painel com estilo padronizado */}
          <div className="w-[23vw] h-auto bg-white rounded-md flex flex-col gap-4 p-6 text-black border border-gray-200 shadow-md">
            <div className="flex items-center gap-3">
              <LineChart className="w-6 h-6 text-yellow-700" />
              <h3 className="text-xl font-semibold">
                Resumo dos Investimentos
              </h3>
            </div>

            <ul className="text-sm space-y-1 pl-1">
              <li>
                Total Investido:{" "}
                <strong>R$ {totalInvested.toLocaleString("pt-BR")}</strong>
              </li>
              <li>
                Valor Atual:{" "}
                <strong>
                  R${" "}
                  {totalCurrent.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </li>
              <li
                className={`${
                  totalProfit >= 0 ? "text-green-700" : "text-red-700"
                } font-semibold`}
              >
                {totalProfit >= 0 ? "Lucro" : "Prejuízo"}: R${" "}
                {Math.abs(totalProfit).toFixed(2)} (
                {totalProfitPercent.toFixed(2)}%)
              </li>
              <li>
                Média Variação 24h:{" "}
                <span
                  className={
                    avgVariation >= 0 ? "text-green-700" : "text-red-700"
                  }
                >
                  {avgVariation >= 0 ? "+" : ""}
                  {avgVariation.toFixed(2)}%
                </span>
              </li>
              <li>
                Maior alta:{" "}
                <strong>
                  {best.name} ({best.symbol})
                </strong>{" "}
                {best.variation.toFixed(2)}%
              </li>
              <li>
                Maior queda:{" "}
                <strong>
                  {
                    enriched.reduce((min, c) =>
                      c.variation < min.variation ? c : min
                    ).name
                  }{" "}
                  (
                  {
                    enriched.reduce((min, c) =>
                      c.variation < min.variation ? c : min
                    ).symbol
                  }
                  )
                </strong>{" "}
                {enriched
                  .reduce((min, c) => (c.variation < min.variation ? c : min))
                  .variation.toFixed(2)}
                %
              </li>
            </ul>

            <div className="border-t border-gray-500 pt-4 mt-2">
              <h4 className="text-lg font-semibold mb-2">Oportunidades</h4>
              <ul className="text-sm space-y-1 pl-1">
                {enriched
                  .filter((c) => c.variation >= 5)
                  .map((c) => (
                    <li key={c.id} className="text-green-800">
                      📈 <strong>{c.name}</strong> subiu{" "}
                      {c.variation.toFixed(2)}% — tendência de alta.
                    </li>
                  ))}
                {enriched
                  .filter((c) => c.variation <= -5)
                  .map((c) => (
                    <li key={c.id} className="text-red-800">
                      📉 <strong>{c.name}</strong> caiu {c.variation.toFixed(2)}
                      % — possível oportunidade.
                    </li>
                  ))}
                {enriched.every((c) => Math.abs(c.variation) < 5) && (
                  <li className="text-gray-700">
                    Nenhuma variação significativa hoje.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
