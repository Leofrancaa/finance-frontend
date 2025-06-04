"use client";

import { TrendingDown } from "lucide-react";
import { useExpenseDashboardStats } from "@/hooks/useExpenseDashboardStats";

export default function ExpensesCard() {
  const { totalCurrent, percentChange, dailyMean } = useExpenseDashboardStats();

  const formattedTotal = totalCurrent.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedMean = dailyMean.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const percentLabel =
    percentChange !== null
      ? `${percentChange > 0 ? "+" : ""}${percentChange.toFixed(0)}%`
      : "N/A";

  return (
    <div className="bg-white border border-blue-100 rounded-lg p-4 w-[25%] shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-800">
          Despesas Totais
        </span>
        <TrendingDown className="w-4 h-4 text-red-600" />
      </div>

      <p className="text-2xl font-bold text-red-600 mb-1">
        R$ {formattedTotal}
      </p>

      <p className="text-sm text-gray-500">
        {percentChange !== null && (
          <>{percentLabel} em relação ao mês passado</>
        )}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Média por dia: <span className="font-medium">R$ {formattedMean}</span>
      </p>
    </div>
  );
}
