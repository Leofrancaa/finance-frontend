"use client";

import { useUser } from "@/contexts/UserContext";
import { useAnnualBalance } from "@/hooks/useAnnualBalance"; // Atualize para usar o hook correto

const UserInfoAndBalance = () => {
  const { user } = useUser();
  const { saldoAnual } = useAnnualBalance(); // Use o saldo anual

  if (!user) {
    return null; // Não exibe nada se o usuário não estiver carregado
  }

  // Formata o saldo para ter duas casas decimais e usar vírgula como separador decimal
  const formattedSaldo = saldoAnual.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="mt-2 mb-5 text-center absolute top-5 right-28 ">
      <p className="text-lg text-gray-800">
        Bem vindo(a): {user.name}, seu saldo atual é: R$ {formattedSaldo}
      </p>
    </div>
  );
};

export const formattedSaldo = (saldo: number) => {
  // Formata o saldo para ter duas casas decimais e usar vírgula como separador decimal
  return saldo.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
export default UserInfoAndBalance;
