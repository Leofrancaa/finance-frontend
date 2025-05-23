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
    const date = new Date(income.date);
    return (
      date.getFullYear() === selectedYear && date.getMonth() === selectedMonth
    );
  });

  const total = filtered.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-black">
        Receitas de {MONTHS[selectedMonth]} {selectedYear} – Total:{" "}
        <span className="text-green-600">R$ {total.toFixed(2)}</span>
      </h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500">Nenhuma receita registrada neste mês.</p>
      ) : (
        <table className="min-w-[900px] w-full bg-white border border-neutral-800 rounded-md overflow-hidden text-sm shadow-md text-black">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Data",
                "Categoria",
                "Fonte",
                "Valor (R$)",
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
            {filtered.map((income, index) => (
              <tr
                key={income._id ?? income.date}
                className={`transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-300"
                }`}
              >
                <td className="px-4 py-2 border-b text-center align-middle">
                  {new Date(income.date).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-2 border-b text-center align-middle">
                  {capitalize(income.type)}
                </td>
                <td className="px-4 py-2 border-b text-center align-middle">
                  {income.source || "-"}
                </td>
                <td className="px-4 py-2 border-b text-center align-middle">
                  R$ {income.amount.toFixed(2)}
                </td>
                <td className="px-4 py-2 border-b text-center align-middle">
                  {income.note || "-"}
                </td>
                <td className="px-4 py-2 border-b text-center align-middle">
                  <div className="flex justify-center gap-2">
                    <EditButton onClick={() => onEdit(income)} />
                    <DeleteButton onClick={() => deleteIncome(income._id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
