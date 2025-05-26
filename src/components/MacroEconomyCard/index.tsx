"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Indicator = {
  id: string;
  name: string;
  icon: string;
  value: string | number | null;
  variation?: number | string | null;
};

export default function MacroEconomyCard() {
  const [data, setData] = useState<Record<string, Indicator>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMacro = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/macro");
        const json = await res.json();

        const formatted: Record<string, Indicator> = {
          selic: {
            id: "selic",
            name: "Taxa Selic",
            icon: "/selic.png",
            value: json.selic?.value ? `${json.selic.value}%` : null,
            variation: json.selic?.variation ?? null,
          },
          ipca: {
            id: "ipca",
            name: "IPCA (Inflação)",
            icon: "/ipca.png",
            value: json.ipca?.value ? `${json.ipca.value}%` : null,
            variation: json.ipca?.variation ?? null,
          },
          ibovespa: {
            id: "ibovespa",
            name: "Ibovespa",
            icon: "/ibovespa.png",
            value:
              json.ibovespa?.value !== null
                ? `R$ ${json.ibovespa.value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`
                : null,
            variation: json.ibovespa?.variation ?? null,
          },
          usd: {
            id: "usd",
            name: "Dólar (USD/BRL)",
            icon: "/dolar.png",
            value:
              json.usd?.value !== null
                ? `R$ ${json.usd.value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`
                : null,
            variation: json.usd?.variation ?? null,
          },
        };

        setData(formatted);
      } catch (error) {
        console.error("Erro ao buscar indicadores econômicos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMacro();
    const interval = setInterval(fetchMacro, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        🌐 Indicadores Econômicos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        {Object.values(data).map((item) => {
          const isPositive =
            typeof item.variation === "number"
              ? item.variation >= 0
              : typeof item.variation === "string"
              ? !item.variation.includes("-")
              : true;

          return (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md px-5 py-4 w-full h-[125px]"
            >
              <div className="flex gap-2 items-center mb-2">
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h3 className="text-md font-semibold text-gray-800">
                  {item.name}
                </h3>
              </div>

              <p className="text-sm text-gray-700">
                Valor atual:{" "}
                <strong className="text-black">
                  {loading
                    ? "Carregando..."
                    : item.value ?? (
                        <span className="text-gray-400">Indisponível</span>
                      )}
                </strong>
              </p>

              {item.variation !== undefined && (
                <p
                  className={`text-sm font-semibold ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {typeof item.variation === "number"
                    ? `Variação 24h: ${
                        isPositive ? "+" : ""
                      }${item.variation.toFixed(2)}%`
                    : `Variação anual: ${item.variation}`}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
