"use client";

import { Expense } from "@/interfaces/Expense";
import { useAlertThreshold } from "@/contexts/AlertThresholdContext";
import { useCreditCards } from "@/contexts/CreditCardContext";
import { capitalize } from "@/utils/capitalize";
import { MONTHS } from "@/utils/constants";
import EditButton from "../EditButton";
import DeleteButton from "../DeleteButton";
import { AlertTriangle } from "lucide-react";
import { CategoryProvider } from "../../contexts/CategoryContext";

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
    <CategoryProvider>
      <div className="w-full">
        <h2 className="text-lg lg:text-xl font-bold mb-4 text-black">
          Despesas de {MONTHS[month]} {year} – Total:{" "}
          <span className="font-semibold text-red-600">
            R$ {totalMonthly.toFixed(2)}
          </span>
        </h2>

        {alerts.length > 0 && (
          <div className="border border-red-300 bg-red-50 text-red-700 text-sm rounded-md px-5 py-4 mb-6 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-red-800 text-base">
              <AlertTriangle className="w-5 h-5" />
              Limite de Gastos Excedido
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {alerts.map((type) => {
                const gasto = gastosPorCategoria[type];
                const limite = thresholds[type];
                const excedente = gasto - limite;

                return (
                  <div
                    key={type}
                    className="bg-white rounded-md border border-red-200 px-4 py-3 shadow-sm"
                  >
                    <p className="font-semibold text-red-700 mb-1">
                      {capitalize(type)}
                    </p>
                    <p className="text-gray-800">
                      Gasto:{" "}
                      <span className="font-semibold text-red-600">
                        R$ {gasto.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-gray-800">
                      Limite:{" "}
                      <span className="font-semibold text-gray-900">
                        R$ {limite.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      ⚠️ Excedente: <strong>R$ {excedente.toFixed(2)}</strong>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {filteredMonthly.map((exp) => {
            const matchedCard = cards.find((c) => c._id === exp.creditCardId);

            return (
              <div
                key={exp._id}
                className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 grid gap-0"
              >
                {/* Cabeçalho com título e botões */}
                <div className="flex justify-between items-center">
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
                  <div className="flex gap-2">
                    <EditButton onClick={() => onEdit(exp)} />
                    <DeleteButton onClick={() => onDelete(exp._id)} />
                  </div>
                </div>

                {/* Detalhes em grid responsivo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-y-2 text-sm font-medium text-gray-700">
                  <span>
                    <strong className="text-gray-800">Valor:</strong> R${" "}
                    {exp.amount.toFixed(2)}
                  </span>
                  <span>
                    <strong className="text-gray-800">Categoria:</strong>{" "}
                    {capitalize(exp.type)}
                  </span>
                  <span>
                    <strong className="text-gray-800">Data:</strong>{" "}
                    {new Date(exp.date).toLocaleDateString("pt-BR")}
                  </span>
                  <span>
                    <strong className="text-gray-800">Pagamento:</strong>{" "}
                    {exp.paymentMethod}
                  </span>
                  <span>
                    <strong className="text-gray-800">Cartão:</strong>{" "}
                    {matchedCard
                      ? `${matchedCard.name} •••• ${matchedCard.lastDigits}`
                      : "-"}
                  </span>
                </div>

                {exp.note && (
                  <p className="text-gray-600 text-sm mt-2">{exp.note}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </CategoryProvider>
  );
};
