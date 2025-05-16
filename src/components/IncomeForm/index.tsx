"use client";

import { useState, useEffect } from "react";
import { useIncomes } from "@/contexts/IncomesContext";
import { useCategory } from "@/contexts/CategoryContext"; // <-- AQUI
import { Income } from "@/interfaces/Income";
import { postIncomeToAPI, updateIncomeInAPI } from "@/services/incomeService";
import { getUserIdFromToken } from "@/utils/auth";
import { useDate } from "@/contexts/DateContext";

interface IncomeFormProps {
  incomeToEdit?: Income | null;
  onCancelEdit?: () => void;
  onIncomeUpdated?: () => void;
}

interface IncomeFormData {
  type: string;
  amount: string;
  day: string;
  note: string;
  source: string;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({
  incomeToEdit,
  onCancelEdit,
  onIncomeUpdated,
}) => {
  const { addIncome, updateIncome } = useIncomes();
  const { selectedYear, selectedMonth } = useDate();
  const { incomeCategories, isIncomeLoading } = useCategory(); // <-- AQUI

  const initialFormData: IncomeFormData = {
    type: "",
    amount: "",
    day: "",
    note: "",
    source: "",
  };

  const [form, setForm] = useState<IncomeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (incomeToEdit) {
      setIsEditing(true);
      const dayToSet = incomeToEdit.date
        ? new Date(incomeToEdit.date).getDate().toString()
        : incomeToEdit.day.toString();

      setForm({
        type: incomeToEdit.type,
        amount: incomeToEdit.amount.toString(),
        day: dayToSet,
        note: incomeToEdit.note || "",
        source: incomeToEdit.source || "",
      });
    } else {
      setIsEditing(false);
      setForm(initialFormData);
    }
  }, [incomeToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!form.type || !form.amount || !form.day) {
      alert("Preencha todos os campos obrigatórios (Tipo, Valor, Dia).");
      setIsSubmitting(false);
      return;
    }

    const dayNumber = parseInt(form.day, 10);
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
      alert("Dia inválido. Insira um número entre 1 e 31.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Usuário não autenticado.");

      const fullDate = new Date(
        selectedYear,
        selectedMonth,
        dayNumber
      ).toISOString();

      const incomeDataPayload = {
        type: form.type,
        amount: parseFloat(form.amount) || 0,
        note: form.note,
        source: form.source,
        userId,
        date: fullDate,
        day: dayNumber,
      };

      if (incomeDataPayload.amount <= 0) {
        alert("O valor da receita deve ser maior que zero.");
        setIsSubmitting(false);
        return;
      }

      if (isEditing && incomeToEdit) {
        if (!incomeToEdit._id)
          throw new Error("ID da receita para edição não encontrado.");

        const updatedData = await updateIncomeInAPI(
          incomeToEdit._id,
          incomeDataPayload
        );
        updateIncome(updatedData);
        onIncomeUpdated?.();
        alert("Receita atualizada com sucesso!");
      } else {
        const saved = await postIncomeToAPI(incomeDataPayload);
        addIncome(saved);
        alert("Receita adicionada com sucesso!");
      }

      setForm(initialFormData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      const action = isEditing ? "atualizar" : "salvar";
      alert(`Erro ao ${action} receita.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-white rounded p-4 border mt-2"
    >
      {/* Select de tipo de receita (agora baseado nas categorias do usuário) */}
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      >
        <option value="">Tipo de receita</option>
        {isIncomeLoading ? (
          <option disabled>Carregando categorias...</option>
        ) : incomeCategories.length === 0 ? (
          <option disabled>Nenhuma categoria cadastrada</option>
        ) : (
          incomeCategories.map((type) => (
            <option key={type} value={type}>
              {type[0].toUpperCase() + type.slice(1)}
            </option>
          ))
        )}
      </select>

      <input
        name="amount"
        type="number"
        min="0.01"
        step="0.01"
        value={form.amount}
        onChange={handleChange}
        placeholder="Valor"
        className="p-2 border rounded"
        required
      />

      <input
        name="day"
        type="number"
        min="1"
        max="31"
        value={form.day}
        onChange={handleChange}
        placeholder="Dia do mês"
        required
        className="w-full p-2 border rounded"
      />

      <input
        name="note"
        type="text"
        value={form.note}
        onChange={handleChange}
        placeholder="Observação (opcional)"
        className="p-2 border rounded"
      />

      <input
        name="source"
        type="text"
        value={form.source}
        onChange={handleChange}
        placeholder="Fonte (opcional)"
        className="p-2 border rounded"
      />

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 py-2 text-white font-bold rounded transition duration-200 cursor-pointer ${
            isSubmitting
              ? "bg-gray-400"
              : isEditing
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSubmitting
            ? "Salvando..."
            : isEditing
            ? "Atualizar Receita"
            : "Adicionar Receita"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setForm(initialFormData);
              setIsEditing(false);
              onCancelEdit?.();
            }}
            disabled={isSubmitting}
            className="flex-1 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 transition duration-200 cursor-pointer"
          >
            Cancelar Edição
          </button>
        )}
      </div>
    </form>
  );
};
