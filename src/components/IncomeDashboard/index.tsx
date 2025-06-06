"use client";

import { useIncomes } from "@/contexts/IncomesContext";
import { useDate } from "@/contexts/DateContext";
import { MONTHS } from "@/utils/constants";
import { Income } from "@/interfaces/Income";
import EditButton from "../EditButton";
import DeleteButton from "../DeleteButton";
import { capitalize } from "@/utils/capitalize";

interface IncomeDashboardProps {
  onEdit: (income: Income) => void;
}

export const IncomeDashboard: React.FC<IncomeDashboardProps> = ({ onEdit }) => {
  const { selectedYear, selectedMonth } = useDate();
  const { incomes, deleteIncome } = useIncomes();

  const filtered = incomes.filter((income) => {
    if (!income.date) return false;
    const [year, month] = income.date.split("-").map(Number);
    return year === selectedYear && month - 1 === selectedMonth;
  });

  const total = filtered.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="w-full">
      <h2 className="text-lg lg:text-xl font-bold mb-4 text-black">
        Receitas de {MONTHS[selectedMonth]} {selectedYear} – Total:{" "}
        <span className="text-green-600">R$ {total.toFixed(2)}</span>
      </h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500">Nenhuma receita registrada neste mês.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((income) => (
            <div
              key={income._id}
              className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 flex flex-col"
            >
              {/* Linha 1: Categoria + Ações */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {capitalize(income.type)}
                    </h3>
                  </div>
                </div>

                <div className="flex gap-2">
                  <EditButton onClick={() => onEdit(income)} />
                  <DeleteButton
                    onClick={() => deleteIncome(income._id)}
                    width={6}
                  />
                </div>
              </div>

              {/* Linha 2: Dados */}
              <div className="grid grid-cols-1 lg:flex lg:flex-wrap gap-x-8 justify-between text-gray-800 text-sm font-semibold w-[85%] mb-2">
                <span className="text-gray-500">
                  <strong className="text-gray-800">Categoria:</strong>{" "}
                  {capitalize(income.type)}
                </span>
                <span className="text-gray-500">
                  <strong className="text-gray-800">Valor:</strong> R${" "}
                  {income.amount.toFixed(2)}
                </span>
                <span className="text-gray-500">
                  <strong className="text-gray-800">Data:</strong>{" "}
                  {income.date.split("-").reverse().join("/")}
                </span>
                <span className="text-gray-500">
                  <strong className="text-gray-800">Fonte:</strong>{" "}
                  {income.source || "-"}
                </span>
              </div>

              {income.note && (
                <p className="text-gray-600 text-sm mt-1">
                  <strong className="text-gray-800">Observação:</strong>{" "}
                  {income.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
