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
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-black">
        Investimentos de {MONTHS[month]} {year} – Total:{" "}
        <span className="text-green-600">R$ {totalMonthly.toFixed(2)}</span>
      </h2>

      {filteredMonthly.length === 0 ? (
        <p className="text-gray-500">
          Nenhum investimento registrado neste mês.
        </p>
      ) : (
        <table className="min-w-[900px] w-full bg-white border border-neutral-800 rounded-md overflow-hidden text-sm shadow-md text-black">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Data",
                "Tipo",
                "Nome do Ativo",
                "Valor (R$)",
                "Criptoativo",
                "Descrição",
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
            {filteredMonthly.map((inv, index) => (
              <tr
                key={inv._id}
                className={`transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-300"
                }`}
              >
                <td className="px-4 py-2 border-b text-center">
                  {new Date(inv.date).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-2 border-b text-center">{inv.type}</td>
                <td className="px-4 py-2 border-b text-center">{inv.name}</td>
                <td className="px-4 py-2 border-b text-center">
                  R$ {inv.amount.toFixed(2)}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {inv.isCrypto ? "Sim" : "Não"}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {inv.description || "-"}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <div className="flex justify-center gap-2">
                    <EditButton onClick={() => onEdit(inv)} />
                    <DeleteButton onClick={() => onDelete(inv._id!)} />
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
