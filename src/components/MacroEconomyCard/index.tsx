"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { API_BASE_URL } from "../../utils/api";

const indicatorsList = [
  {
    id: "selic",
    name: "Taxa Selic",
    icon: "/selic.png",
  },
  {
    id: "ipca",
    name: "IPCA (Inflação)",
    icon: "/ipca.png",
  },
  {
    id: "ibovespa",
    name: "Ibovespa",
    icon: "/ibovespa.png",
  },
  {
    id: "usd",
    name: "Dólar (USD/BRL)",
    icon: "/dolar.png",
  },
];

type Indicator = {
  id: string;
  value: number | string | null;
  variation?: number | string | null;
};

export default function MacroEconomyCard() {
  const [data, setData] = useState<Record<string, Indicator>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMacro = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/macro`);
        const json = await res.json();

        const formatted: Record<string, Indicator> = {
          selic: {
            id: "selic",
            value: json.selic?.value ?? null,
            variation: json.selic?.variation ?? null,
          },
          ipca: {
            id: "ipca",
            value: json.ipca?.value ?? null,
            variation: json.ipca?.variation ?? null,
          },
          ibovespa: {
            id: "ibovespa",
            value: json.ibovespa?.value ?? null,
            variation: json.ibovespa?.variation ?? null,
          },
          usd: {
            id: "usd",
            value: json.usd?.value ?? null,
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
    <section className="w-full flex flex-col">
      <h2 className="text-lg lg:text-2xl font-semibold text-gray-800 mb-4">
        🌐 Indicadores Econômicos
      </h2>
      <div className="grid grid-cols-1  md:grid-cols-2 gap-x-4 gap-y-6">
        {indicatorsList.map((indicator) => {
          const info = data[indicator.id];
          const isPositive =
            typeof info?.variation === "number"
              ? info.variation >= 0
              : typeof info?.variation === "string"
              ? !info.variation.includes("-")
              : true;

          return (
            <div
              key={indicator.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md px-5 py-4 w-full h-[125px]"
            >
              <div className="flex gap-2 items-center mb-2">
                <Image
                  src={indicator.icon}
                  alt={indicator.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h3 className="text-md font-semibold text-gray-800">
                  {indicator.name}
                </h3>
              </div>

              {loading ? (
                <p className="text-sm text-gray-500">Carregando...</p>
              ) : info?.value != null ? (
                <>
                  <p className="text-sm text-gray-700">
                    Valor atual:{" "}
                    <strong className="text-black">
                      {typeof info.value === "number"
                        ? `R$ ${info.value.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}`
                        : info.value}
                    </strong>
                  </p>
                  {info.variation !== undefined && (
                    <p
                      className={`text-sm font-semibold ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {typeof info.variation === "number"
                        ? `Variação 24h: ${
                            isPositive ? "+" : ""
                          }${info.variation.toFixed(2)}%`
                        : `Variação anual: ${info.variation}`}
                    </p>
                  )}
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
