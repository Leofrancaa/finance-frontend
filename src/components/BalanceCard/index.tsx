"use client";

import { Wallet } from "lucide-react";
import { useExpenseDashboardStats } from "@/hooks/useExpenseDashboardStats";
import { useIncomeDashboardStats } from "@/hooks/useIncomeDashboardStats";

export default function BalanceCard() {
  const { totalCurrent: totalDespesas } = useExpenseDashboardStats();
  const { totalCurrent: totalReceitas } = useIncomeDashboardStats();

  const saldo = totalReceitas - totalDespesas;
  const isPositive = saldo >= 0;

  const formattedBalance = saldo.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-white border border-blue-100 rounded-lg p-4 w-[25%] shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-800">Saldo Atual</span>
        <Wallet className="w-4 h-4 text-blue-600" />
      </div>

      <p
        className={`text-2xl font-bold ${
          isPositive ? "text-green-600" : "text-red-600"
        } mb-1`}
      >
        R$ {formattedBalance}
      </p>

      <p className="text-sm text-gray-500">
        {isPositive ? "Saldo positivo" : "Saldo negativo"}
      </p>
    </div>
  );
}
