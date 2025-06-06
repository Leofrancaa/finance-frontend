"use client";

import { useState, useEffect } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { useIncomes } from "@/contexts/IncomesContext";
import { useCategory } from "@/contexts/CategoryContext";
import { Income } from "@/interfaces/Income";
import { postIncomeToAPI, updateIncomeInAPI } from "@/services/incomeService";
import { getUserIdFromToken } from "@/utils/auth";

interface IncomeFormProps {
  incomeToEdit?: Income | null;
  onCancelEdit?: () => void;
  onIncomeUpdated?: () => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({
  incomeToEdit,
  onCancelEdit,
  onIncomeUpdated,
}) => {
  const { addIncome, updateIncome } = useIncomes();
  const { incomeCategories } = useCategory();

  const [form, setForm] = useState({
    type: "",
    amount: "",
    date: "",
    note: "",
    source: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (incomeToEdit) {
      setIsEditing(true);
      const isoDate = new Date(incomeToEdit.date).toISOString().split("T")[0];
      setForm({
        type: incomeToEdit.type || "",
        amount: incomeToEdit.amount.toString(),
        date: isoDate,
        note: incomeToEdit.note || "",
        source: incomeToEdit.source || "",
      });
    } else {
      setIsEditing(false);
      setForm({ type: "", amount: "", date: "", note: "", source: "" });
    }
  }, [incomeToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!form.type || !form.amount || !form.date) {
      alert("Preencha os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = getUserIdFromToken();

      const payload = {
        type: form.type,
        amount: parseFloat(form.amount),
        note: form.note,
        source: form.source,
        date: form.date,
        userId,
      };

      if (isEditing && incomeToEdit && incomeToEdit._id) {
        const updated = await updateIncomeInAPI(incomeToEdit._id, payload);
        updateIncome(updated);
        alert("Receita atualizada com sucesso!");
      } else {
        const saved = await postIncomeToAPI(payload);
        addIncome(saved);
        alert("Receita adicionada com sucesso!");
      }

      setForm({ type: "", amount: "", date: "", note: "", source: "" });
      setIsEditing(false);
      onIncomeUpdated?.();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar receita.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = incomeCategories.map((name) => ({
    value: name,
    label: name,
  }));

  return (
    <div className="fixed inset-0 z-50 bg-transparent bg-opacity-30 flex justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-3xl shadow-lg my-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Editar Receita" : "Cadastro de Receita"}
          </h2>
          {onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-gray-500 hover:text-black text-2xl leading-none"
            >
              &times;
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="type"
              label="Tipo"
              value={form.type}
              onChange={handleChange}
              options={categoryOptions}
              required
            />
            <Input
              id="amount"
              name="amount"
              label="Valor (R$)"
              type="number"
              min="0.01"
              placeholder="R$ 0,00"
              required
              value={form.amount}
              onChange={handleChange}
            />

            <Input
              id="date"
              name="date"
              label="Data"
              type="date"
              required
              value={form.date}
              onChange={handleChange}
            />
            <Input
              id="source"
              name="source"
              label="Fonte"
              placeholder="Fonte (opcional)"
              value={form.source}
              onChange={handleChange}
            />
          </div>

          <div className="mt-2">
            <Input
              id="note"
              name="note"
              label="Observação"
              placeholder="Observação (opcional)"
              value={form.note}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : isEditing
                ? "Atualizar Receita"
                : "Salvar Receita"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeForm;
