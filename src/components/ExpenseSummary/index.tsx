"use client";

import { Expense } from "@/interfaces/Expense";
import { useAlertThreshold } from "@/contexts/AlertThresholdContext";
import { useCreditCards } from "@/contexts/CreditCardContext";
import { capitalize } from "@/utils/capitalize";
import { MONTHS } from "@/utils/constants";
import EditButton from "../EditButton";
import DeleteButton from "../DeleteButton";

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
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-black">
        Despesas de {MONTHS[month]} {year} – Total:{" "}
        <span className="text-red-600">R$ {totalMonthly.toFixed(2)}</span>
      </h2>

      {alerts.length > 0 && (
        <div className="p-3 bg-yellow-100 border-l-4 border-yellow-600 text-yellow-800 rounded-md mb-4">
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
        <p className="text-gray-500">Nenhuma despesa registrada neste mês.</p>
      ) : (
        <table className="min-w-[900px] w-full bg-white border border-neutral-800 rounded-md overflow-hidden text-sm shadow-md text-black">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Data",
                "Categoria",
                "Subcategoria",
                "Valor (R$)",
                "Forma de Pagamento",
                "Cartão",
                "Observação",
                "Ações",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 border-b text-center font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMonthly.map((exp, index) => {
              const matchedCard = cards.find((c) => c._id === exp.creditCardId);

              return (
                <tr
                  key={exp._id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2 border-b text-center align-middle">
                    {new Date(exp.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-2 border-b text-center align-middle">
                    {capitalize(exp.type)}{" "}
                    {exp.fixed && (
                      <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-300 text-black rounded">
                        Fixo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b text-center align-middle">
                    {capitalize(exp.subcategory || "-")}
                  </td>
                  <td className="px-4 py-2 border-b text-center align-middle">
                    R$ {exp.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b text-center align-middle">
                    {exp.paymentMethod}
                  </td>
                  <td className="px-4 py-2 border-b text-center align-middle">
                    {matchedCard
                      ? `${matchedCard.name} •••• ${matchedCard.lastDigits}`
                      : "-"}
                  </td>
                  <td className="px-4 py-2 border-b text-center align-middle">
                    {exp.note || "-"}
                  </td>
                  <td className="px-4 py-2 border-b text-center align-middle">
                    <div className="flex justify-center gap-2">
                      <EditButton onClick={() => onEdit(exp)} />

                      <DeleteButton onClick={() => onDelete(exp._id)} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
