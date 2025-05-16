"use client";
import { useIncomes } from "@/contexts/IncomesContext";
import { useDate } from "@/contexts/DateContext";
import { MONTHS } from "../../utils/constants";
import { Income } from "@/interfaces/Income"; // Importa a interface Income

// Define as props do componente
interface IncomeDashboardProps {
  // Não precisa mais passar incomes/deleteIncome via props, pois usa o contexto
  onEdit: (income: Income) => void; // Adiciona prop para edição
}

export const IncomeDashboard: React.FC<IncomeDashboardProps> = ({ onEdit }) => {
  const { selectedYear, selectedMonth } = useDate();
  // Obtém incomes e deleteIncome diretamente do contexto
  const { incomes, deleteIncome } = useIncomes();

  const filtered = incomes.filter((income) => {
    const date = new Date(income.date);
    return (
      date.getFullYear() === selectedYear && date.getMonth() === selectedMonth
    );
  });

  const total = filtered.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="p-4 bg-blue-50 border rounded my-6">
      <strong className="block text-blue-900 text-lg mb-4">
        Total de receitas em {MONTHS[selectedMonth]} de {selectedYear}: R${" "}
        {total.toFixed(2)}
      </strong>

      {filtered.length === 0 ? (
        <p className="text-gray-600 text-sm mt-2">
          Nenhuma receita cadastrada neste período.
        </p>
      ) : (
        <ul className="mt-2 text-sm text-blue-900 space-y-3">
          {filtered.map((income) => (
            <li
              // Usa _id do backend se disponível, senão o id gerado no front
              key={income._id ?? income.date}
              className="bg-white p-3 rounded-md flex justify-between items-center shadow"
            >
              <div>
                {new Date(income.date).toLocaleDateString("pt-BR")} —{" "}
                {/* Capitaliza o tipo */}
                {income.type
                  ? income.type[0].toUpperCase() + income.type.slice(1)
                  : "Tipo não definido"}
                : <b>R$ {income.amount.toFixed(2)}</b>
                {income.note && <span> ({income.note})</span>}
              </div>
              {/* Container para os botões */}
              <div className="flex gap-2">
                <button
                  // Chama onEdit passando a receita completa
                  onClick={() => onEdit(income)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded cursor-pointer transition-colors duration-200"
                >
                  Editar
                </button>
                <button
                  // Usa _id do backend se disponível para deletar
                  onClick={() => deleteIncome(income._id)}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 px-4 rounded cursor-pointer transition-colors duration-200"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
