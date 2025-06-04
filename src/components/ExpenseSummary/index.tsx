"use client";

import { Expense } from "@/interfaces/Expense";
import { useAlertThreshold } from "@/contexts/AlertThresholdContext";
import { useCreditCards } from "@/contexts/CreditCardContext";
import { capitalize } from "@/utils/capitalize";
import { MONTHS } from "@/utils/constants";
import EditButton from "../EditButton";
import DeleteButton from "../DeleteButton";
import { AlertTriangle } from "lucide-react";

interface Props {
  expenses: Expense[];
  year: number;
  month: number;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export const ExpenseSummary: React.FC<Props> = ({
  expenses,
  year,
  month,
  onDelete,
  onEdit,
}) => {
  const { thresholds } = useAlertThreshold();
  const { cards } = useCreditCards();

  const filteredMonthly = expenses.filter((e) => {
    if (!e.date) return false;
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const totalMonthly = filteredMonthly.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const gastosPorCategoria: Record<string, number> = {};
  filteredMonthly.forEach((e) => {
    gastosPorCategoria[e.type] = (gastosPorCategoria[e.type] || 0) + e.amount;
  });

  const alerts = Object.entries(thresholds)
    .filter(
      ([type, limit]) =>
        gastosPorCategoria[type] && gastosPorCategoria[type] > limit
    )
    .map(([type]) => type);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-black">
        Despesas de {MONTHS[month]} {year} – Total:{" "}
        <span className="text-red-600">R$ {totalMonthly.toFixed(2)}</span>
      </h2>

      {alerts.length > 0 && (
        <div className="border border-red-300 bg-red-50 text-red-600 text-sm rounded-md px-4 py-3 mb-4">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" />
            Limite Excedido!
          </div>
          {alerts.map((type) => {
            const gasto = gastosPorCategoria[type];
            const limite = thresholds[type];
            const excedente = gasto - limite;

            return (
              <p key={type}>
                A categoria &quot;<strong>{capitalize(type)}</strong>&quot;
                ultrapassou o limite em{" "}
                <strong>R$ {excedente.toFixed(2)}</strong>. Gasto: R${" "}
                {gasto.toFixed(2)} / Limite: R$ {limite.toFixed(2)}
              </p>
            );
          })}
        </div>
      )}

      <div className="space-y-4">
        {filteredMonthly.map((exp) => {
          const matchedCard = cards.find((c) => c._id === exp.creditCardId);

          return (
            <div
              key={exp._id}
              className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 flex flex-col"
            >
              {/* Linha 1: Nome + Fixa + Ações */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {capitalize(exp.type)}
                    </h3>
                    {exp.fixed && (
                      <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Fixa
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <EditButton onClick={() => onEdit(exp)} />
                  <DeleteButton onClick={() => onDelete(exp._id)} />
                </div>
              </div>

              {/* Linha 2: Dados em linha */}
              <div className="flex flex-wrap gap-x-8 justify-between text-gray-800 text-sm font-semibold w-[85%] mb-2">
                <span className="text-gray-500">
                  <strong className="text-gray-800">Valor:</strong> R${" "}
                  {exp.amount.toFixed(2)}
                </span>
                <span className="text-gray-500">
                  <strong className="text-gray-800">Categoria:</strong>{" "}
                  {capitalize(exp.type)}
                </span>
                <span className="text-gray-500">
                  <strong className="text-gray-800">Data:</strong>{" "}
                  {new Date(exp.date).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-gray-500">
                  <strong className="text-gray-800">Pagamento:</strong>{" "}
                  {exp.paymentMethod}
                </span>
                <span className="text-gray-500">
                  <strong className="text-gray-800">Cartão:</strong>{" "}
                  {matchedCard
                    ? `${matchedCard.name} •••• ${matchedCard.lastDigits}`
                    : "-"}
                </span>
              </div>

              {exp.note && (
                <p className="text-gray-600 text-sm mt-1">{exp.note}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
