"use client";

import { Investment } from "@/interfaces/Investment";
import { MONTHS } from "@/utils/constants";
import EditButton from "../EditButton";
import DeleteButton from "../DeleteButton";

interface Props {
  investments: Investment[];
  year: number;
  month: number;
  onDelete: (id: string) => void;
  onEdit: (inv: Investment) => void;
}

export const InvestmentSummary: React.FC<Props> = ({
  investments,
  year,
  month,
  onDelete,
  onEdit,
}) => {
  const filteredMonthly = investments.filter((inv) => {
    if (!inv.date) return false;
    const d = new Date(inv.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const totalMonthly = filteredMonthly.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="w-full">
      <h2 className="text-md lg:text-xl font-bold mb-4 text-black">
        Investimentos de {MONTHS[month]} {year} – Total:{" "}
        <span className="text-green-600">R$ {totalMonthly.toFixed(2)}</span>
      </h2>

      <div className="grid gap-4">
        {filteredMonthly.length === 0 ? (
          <p className="text-gray-500">
            Nenhum investimento registrado neste mês.
          </p>
        ) : (
          filteredMonthly.map((inv) => (
            <div
              key={inv._id}
              className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 grid gap-0"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">{inv.name}</h3>
                <div className="flex gap-2">
                  <EditButton onClick={() => onEdit(inv)} />
                  <DeleteButton onClick={() => inv._id && onDelete(inv._id)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-y-2 text-sm font-medium text-gray-700">
                <span>
                  <strong className="text-gray-800">Valor:</strong> R${" "}
                  {inv.amount.toFixed(2)}
                </span>
                <span>
                  <strong className="text-gray-800">Data:</strong>{" "}
                  {new Date(inv.date).toLocaleDateString("pt-BR")}
                </span>
                <span>
                  <strong className="text-gray-800">Tipo:</strong> {inv.type}
                </span>
                <span>
                  <strong className="text-gray-800">Criptoativo:</strong>{" "}
                  {inv.isCrypto ? "Sim" : "Não"}
                </span>
                <span>
                  <strong className="text-gray-800">Descrição:</strong>{" "}
                  {inv.description || "-"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
