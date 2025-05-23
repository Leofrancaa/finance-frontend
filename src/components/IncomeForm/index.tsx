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
import { useDate } from "@/contexts/DateContext";
import { MONTHS } from "@/utils/constants";

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
  const { selectedYear, selectedMonth, setMonth } = useDate();
  const { incomeCategories } = useCategory();

  const [form, setForm] = useState({
    type: "",
    amount: "",
    day: "",
    note: "",
    source: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (incomeToEdit) {
      setIsEditing(true);
      const date = new Date(incomeToEdit.date);
      setForm({
        type: incomeToEdit.type || "",
        amount: incomeToEdit.amount.toString(),
        day: date.getDate().toString(),
        note: incomeToEdit.note || "",
        source: incomeToEdit.source || "",
      });
      setMonth(date.getMonth());
    } else {
      setIsEditing(false);
      setForm({
        type: "",
        amount: "",
        day: "",
        note: "",
        source: "",
      });
    }
  }, [incomeToEdit, setMonth]);

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

    if (!form.type || !form.amount || !form.day) {
      alert("Preencha os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = getUserIdFromToken();
      const day = parseInt(form.day);
      const date = new Date(selectedYear, selectedMonth, day).toISOString();

      const payload = {
        type: form.type,
        amount: parseFloat(form.amount),
        note: form.note,
        source: form.source,
        day,
        date,
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

      setForm({ type: "", amount: "", day: "", note: "", source: "" });
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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="mb-6 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isEditing ? "Editar Receita" : "Cadastro de Receita"}
        </h2>
        <p className="text-gray-600">Preencha os dados da sua receita</p>
        {onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="absolute top-0 right-0 text-3xl text-gray-500 hover:text-black cursor-pointer"
          >
            &times;
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="month"
            label="Mês"
            value={selectedMonth.toString()}
            onChange={(e) => setMonth(Number(e.target.value))}
            options={MONTHS.map((m, i) => ({ value: i.toString(), label: m }))}
            required
          />
          <Input
            id="day"
            name="day"
            label="Dia do mês"
            type="number"
            required
            placeholder="1-31"
            value={form.day}
            onChange={handleChange}
          />
        </div>

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
          id="note"
          name="note"
          label="Observação"
          placeholder="Observação (opcional)"
          value={form.note}
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

        <div className="pt-4 flex flex-col md:flex-row gap-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Salvando..."
              : isEditing
              ? "Atualizar Receita"
              : "Salvar Receita"}
          </Button>

          {isEditing && (
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancelar edição
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default IncomeForm;
