"use client";

import { useEffect, useState } from "react";

const options = [
  { value: "selic", label: "Renda Fixa (Selic)" },
  { value: "cdi", label: "CDB (CDI)" },
  { value: "bitcoin", label: "Bitcoin" },
];

export default function InvestmentSimulator() {
  const [amount, setAmount] = useState(1000);
  const [months, setMonths] = useState(12);
  const [type, setType] = useState("selic");

  const [selicRate, setSelicRate] = useState(0);
  const [cdiRate, setCdiRate] = useState(0);
  const [btcChange, setBtcChange] = useState(0); // 24h % como base de risco

  const [result, setResult] = useState(0);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const selicRes = await fetch(
          "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados/ultimos/1?formato=json"
        );
        const selicData = await selicRes.json();
        setSelicRate(parseFloat(selicData[0].valor));

        const cdiRes = await fetch(
          "https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/1?formato=json"
        );
        const cdiData = await cdiRes.json();
        setCdiRate(parseFloat(cdiData[0].valor));

        const btcRes = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl&include_24hr_change=true"
        );
        const btcData = await btcRes.json();
        setBtcChange(btcData.bitcoin.brl_24h_change || 0);
      } catch (err) {
        console.error("Erro ao buscar taxas:", err);
      }
    };

    fetchRates();
  }, []);

  useEffect(() => {
    let rate = 0;

    switch (type) {
      case "selic":
        rate = selicRate;
        break;
      case "cdi":
        rate = cdiRate;
        break;
      case "bitcoin":
        rate = btcChange * 30; // suposição: 24h * 30 dias (exemplo simplificado)
        break;
    }

    const monthlyRate = rate / 100 / 12;
    const finalValue = amount * Math.pow(1 + monthlyRate, months);
    setResult(finalValue);
  }, [amount, months, type, selicRate, cdiRate, btcChange]);

  return (
    <section className="bg-white border border-gray-300 rounded-lg shadow-md px-6 py-6 max-w-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        🧮 Simulador de Investimento
      </h2>

      <div className="flex flex-col gap-4 text-sm">
        <label>
          Valor inicial (R$):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full mt-1 px-3 py-2 border rounded-md"
          />
        </label>

        <label>
          Prazo (meses):
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full mt-1 px-3 py-2 border rounded-md"
          />
        </label>

        <label>
          Tipo de investimento:
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 text-gray-800">
        <p className="text-sm">📈 Valor estimado ao final do período:</p>
        <p className="text-2xl font-bold text-green-700">
          R$ {result.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </section>
  );
}
