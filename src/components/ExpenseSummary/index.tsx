"use client";

import { Expense } from "@/interfaces/Expense";
import { useAlertThreshold } from "@/contexts/AlertThresholdContext";
import { capitalize } from "@/utils/capitalize";
import { MONTHS } from "@/utils/constants";

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

  const filteredMonthly = expenses.filter((e) => {
    if (!e.date) return false;
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const totalMonthly = filteredMonthly.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const yearlyExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year;
  });

  const totalByType: Record<string, number> = {};
  yearlyExpenses.forEach((exp) => {
    if (!totalByType[exp.type]) totalByType[exp.type] = 0;
    totalByType[exp.type] += exp.amount;
  });

  const alerts: string[] = [];
  Object.entries(thresholds).forEach(([type, threshold]) => {
    const totalThisMonth = filteredMonthly
      .filter((e) => e.type === type)
      .reduce((sum, e) => sum + e.amount, 0);

    if (totalThisMonth >= threshold * 0.9) {
      alerts.push(type);
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border-2 border-black p-4 rounded-md mt-4 text-black max-h-[60vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">
          Total de {MONTHS[month]}: R$ {totalMonthly.toFixed(2)}
        </h2>

        {alerts.length > 0 && (
          <div
            className="p-3 bg-yellow-100 border-l-4 border-yellow-600 text-yellow-800 rounded-md mb-4"
            role="alert"
            aria-live="polite"
          >
            <p className="font-semibold">Atenção!</p>
            <ul className="list-disc list-inside">
              {alerts.map((type) => (
                <li key={type}>
                  Gasto com <strong>{capitalize(type)}</strong> está próximo ou
                  acima do limite de R$ {thresholds[type].toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {filteredMonthly.length === 0 ? (
          <p className="text-gray-500 mt-2">
            Nenhuma despesa registrada neste mês.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {filteredMonthly.map((exp) => (
              <li
                key={exp._id}
                className="bg-black rounded-md text-white p-3 shadow-lg border-l-4 border-black flex items-center justify-between"
              >
                <div>
                  <span>
                    • {capitalize(exp.type)}{" "}
                    {exp.fixed && (
                      <span className="mx-1 px-2 py-1 rounded bg-yellow-400 text-black text-xs font-semibold">
                        GASTO FIXO
                      </span>
                    )}
                    – {new Date(exp.date).toLocaleDateString()} – R${" "}
                    {exp.amount.toFixed(2)}
                  </span>

                  {exp.subcategory && (
                    <span className="block mt-1 text-blue-300 text-xs">
                      Subcategoria: {capitalize(exp.subcategory)}
                    </span>
                  )}

                  {exp.note && (
                    <span className="block mt-1 text-gray-300">{exp.note}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(exp)}
                    className="text-white px-4 py-2 rounded-md text-xs bg-blue-600 cursor-pointer h-9 hover:bg-blue-500 transition-colors duration-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(exp._id)}
                    className="text-white px-4 py-2 rounded-md text-xs bg-red-600 cursor-pointer h-9 hover:bg-red-500 transition-colors duration-300"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 bg-white rounded-md mt-4 text-black border-2 border-black max-h-[50vh] overflow-y-auto">
        <h2 className="text-xl font-bold">Resumo Anual por Tipo ({year})</h2>
        {Object.keys(totalByType).length === 0 ? (
          <p className="text-gray-500 mt-2">Nenhum gasto lançado neste ano.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {Object.entries(totalByType).map(([type, total]) => (
              <li
                className="bg-black text-white px-4 py-2 rounded-md my-4"
                key={type}
              >
                • {capitalize(type)} – R$ {total.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
