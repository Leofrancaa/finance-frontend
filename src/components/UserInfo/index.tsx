"use client";

import { DollarSign } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useAnnualBalance } from "@/hooks/useAnnualBalance";

const UserInfoAndBalance = () => {
  const { user } = useUser();
  const { saldoAnual } = useAnnualBalance();

  if (!user) return null;

  const formattedSaldo = saldoAnual.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 w-fit flex flex-col gap-2 mt-4">
      <div className="flex items-center gap- font-semibold mb-1">
        <DollarSign size={18} />
        <span>Bem-vindo(a)</span>
      </div>
      <p className="text-sm text-blue-900">{user.name}</p>
      <p className="text-sm text-blue-700">
        Seu saldo atual é: <strong>R$ {formattedSaldo}</strong>
      </p>
    </div>
  );
};

export default UserInfoAndBalance;
