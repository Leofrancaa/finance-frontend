"use client";

import { Trophy, ArrowUpRight } from "lucide-react";
import { useIncomeDashboardStats } from "@/hooks/useIncomeDashboardStats";

export default function IncomeCard() {
  const {
    totalCurrent,
    percentChange,
    daysWithIncome,
    metaAtingida,
    restanteMeta,
    meta,
  } = useIncomeDashboardStats();

  const formattedTotal = totalCurrent.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedRestante = restanteMeta.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedMeta = meta.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const percentLabel =
    percentChange !== null
      ? `${percentChange > 0 ? "+" : ""}${percentChange.toFixed(0)}%`
      : "N/A";

  return (
    <div className="w-full sm:min-w-[250px] sm:max-w-[100%] md:max-w-[48%] lg:max-w-[32%] xl:max-w-[25%] flex-1 bg-white border border-green-100 rounded-lg p-4 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-800">
          Receitas Totais
        </span>
        <ArrowUpRight className="w-4 h-4 text-green-600" />
      </div>

      <p className="text-lg lg:text-2xl font-bold text-green-600 mb-1">
        R$ {formattedTotal}
      </p>

      <p className="text-sm text-gray-500">
        {percentChange !== null && (
          <>{percentLabel} em relação ao mês passado</>
        )}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Dias com receita: <span className="font-medium">{daysWithIncome}</span>
      </p>

      <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
        <Trophy
          className={`w-4 h-4 ${
            metaAtingida ? "text-green-600" : "text-gray-400"
          }`}
        />
        {metaAtingida ? (
          <span>🎉 Meta atingida (R$ {formattedMeta})</span>
        ) : (
          <span>Faltam R$ {formattedRestante} para a meta mensal</span>
        )}
      </div>
    </div>
  );
}
