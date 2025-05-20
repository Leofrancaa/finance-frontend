"use client";

import { useExpenses } from "@/contexts/ExpensesContext";
import { useCreditCards } from "@/contexts/CreditCardContext";
import { useDate } from "@/contexts/DateContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function CreditCardSpendingChart() {
  const { expenses } = useExpenses();
  const { cards } = useCreditCards();
  const { selectedMonth, selectedYear } = useDate();

  // Gera mapa de ID para nome do cartão
  const cardMap = Object.fromEntries(
    cards.map((card) => [card._id, `${card.name} ••••${card.lastDigits}`])
  );

  // Filtra despesas do mês/ano atual com cartão de crédito
  const filtered = expenses.filter((e) => {
    const d = new Date(e.date);
    return (
      e.paymentMethod === "cartão de crédito" &&
      e.creditCardId &&
      d.getFullYear() === selectedYear &&
      d.getMonth() === selectedMonth
    );
  });

  console.log("🔍 Despesas com cartão:", filtered);

  // Soma os valores por cartão
  const totalByCard: Record<string, number> = {};
  filtered.forEach((e) => {
    if (!e.creditCardId) return;
    totalByCard[e.creditCardId] = (totalByCard[e.creditCardId] || 0) + e.amount;
  });

  console.log("📊 Totais por cartão:", totalByCard);

  // Converte para dados do gráfico
  const chartData = Object.entries(totalByCard).map(([cardId, total]) => ({
    name: cardMap[cardId] ?? "Cartão Desconhecido",
    total,
  }));

  console.log("📈 Dados finais do gráfico:", chartData);

  return (
    <div className="w-full h-[400px] bg-white px-4 py-12 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Gastos por Cartão de Crédito</h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">Nenhum gasto com cartão neste mês.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 20 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="total" fill="#6366f1" name="Gasto total" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
