"use client";

import { useState, useEffect } from "react";
import { useDate } from "@/contexts/DateContext";
import { useExpenses } from "@/contexts/ExpensesContext";
import { AddExpenseData, Expense } from "@/interfaces/Expense";
import { useCategory } from "@/contexts/CategoryContext";
import {
  postExpenseToAPI,
  transformAddExpenseData,
  updateExpenseInAPI,
} from "@/services/expenseService";
import {
  buildRecurringPayload,
  postRecurringExpense,
} from "@/services/recurringService";
import { RecurringExpense } from "@/interfaces/RecurringExpense";
import { getUserIdFromToken } from "@/utils/auth";
import { useCreditCards } from "@/contexts/CreditCardContext";

const defaultFormData: AddExpenseData = {
  type: "",
  day: "",
  amount: "",
  paymentMethod: "",
  installments: "",
  note: "",
  fixed: false,
  subcategory: "",
  creditCardId: "",
};

interface ExpenseFormProps {
  expenseToEdit?: Expense | null;
  onCancelEdit?: () => void;
  onExpenseUpdated?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expenseToEdit,
  onCancelEdit,
  onExpenseUpdated,
}) => {
  const { selectedYear, selectedMonth } = useDate();
  const { addExpense, updateExpense } = useExpenses();
  const { categories } = useCategory();
  const { cards: creditCards } = useCreditCards(); // ← Agora usa o contexto de cartões

  const [formData, setFormData] = useState<AddExpenseData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (expenseToEdit) {
      setIsEditing(true);
      setFormData({
        type: expenseToEdit.type,
        day: new Date(expenseToEdit.date).getDate().toString(),
        amount: expenseToEdit.amount.toString(),
        paymentMethod: expenseToEdit.paymentMethod,
        installments: expenseToEdit.installments?.toString() || "",
        note: expenseToEdit.note || "",
        fixed: !!expenseToEdit.fixed,
        subcategory: expenseToEdit.subcategory || "",
        creditCardId: expenseToEdit.creditCardId || "",
      });
    } else {
      setIsEditing(false);
      setFormData(defaultFormData);
    }
  }, [expenseToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };

      // Se o campo alterado for "paymentMethod" e não for cartão de crédito
      if (name === "paymentMethod" && value !== "cartão de crédito") {
        updated.creditCardId = "";
        updated.installments = "";
      }

      return updated;
    });
  };

  const generateRecurringExpensesUntilYearEnd = (
    recurring: RecurringExpense,
    startMonth: number,
    year: number
  ) => {
    const expenses = [];
    for (let m = startMonth; m < 12; m++) {
      expenses.push({
        _id: `recurring-${recurring._id}-${year}-${m + 1}`,
        type: recurring.type,
        amount: recurring.amount,
        date: new Date(year, m, recurring.day).toISOString(),
        note: recurring.note,
        paymentMethod: recurring.paymentMethod,
        fixed: true,
        day: recurring.day,
        subcategory: recurring.subcategory,
        creditCardId: recurring.creditCardId || undefined,
      });
    }
    return expenses;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { type, amount, day, paymentMethod } = formData;

    if (!type || !amount || !day || !paymentMethod) {
      alert("Preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    if (
      paymentMethod === "cartão de crédito" &&
      (!formData.installments || Number(formData.installments) < 1)
    ) {
      alert("Informe o número de parcelas válido.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = getUserIdFromToken();
      const expenseData = transformAddExpenseData(
        formData,
        selectedYear,
        selectedMonth
      );

      // Monta campos condicionais
      const creditCardId =
        formData.paymentMethod === "cartão de crédito"
          ? formData.creditCardId || undefined
          : null;

      const installments =
        formData.paymentMethod === "cartão de crédito"
          ? formData.installments
            ? Number(formData.installments)
            : null
          : null;

      if (isEditing && expenseToEdit) {
        if (!expenseToEdit._id) throw new Error("ID não encontrado.");

        const updatedExpense = await updateExpenseInAPI(expenseToEdit._id, {
          ...expenseData,
          note: formData.note,
          subcategory: formData.subcategory,
          creditCardId,
          installments,
        });

        updateExpense(updatedExpense);
        onExpenseUpdated?.();
        alert("Despesa atualizada com sucesso!");
      } else {
        if (formData.fixed) {
          const recurring = buildRecurringPayload(
            formData,
            selectedYear,
            selectedMonth
          );
          const savedRecurring = await postRecurringExpense({
            ...recurring,
            fixed: true,
          });
          const generated = generateRecurringExpensesUntilYearEnd(
            { ...recurring, _id: savedRecurring._id },
            selectedMonth,
            selectedYear
          );
          for (const exp of generated) {
            const payload = { ...exp, userId };
            const savedExpense = await postExpenseToAPI(payload);
            addExpense(savedExpense);
          }
        } else {
          const payload = {
            ...expenseData,
            userId,
            subcategory: formData.subcategory || "",
            note: formData.note || "",
            creditCardId,
            installments,
          };
          const saved = await postExpenseToAPI(payload);
          addExpense(saved);
          onExpenseUpdated?.(); // fecha o modal após criação
        }
        alert("Despesa adicionada com sucesso!");
      }

      setFormData(defaultFormData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert(`Erro ao ${isEditing ? "atualizar" : "salvar"} despesa.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find((cat) => cat.name === formData.type);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-md flex flex-col gap-4 border mt-2 text-black"
    >
      {/* Tipo da despesa */}
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
        disabled={isEditing && formData.fixed}
      >
        <option value="">Tipo de gasto</option>
        {categories.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name[0].toUpperCase() + cat.name.slice(1)}
          </option>
        ))}
      </select>

      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <select
          name="subcategory"
          value={formData.subcategory || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Subcategoria</option>
          {selectedCategory.subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      )}

      <input
        name="day"
        type="number"
        min={1}
        max={31}
        value={formData.day}
        onChange={handleChange}
        placeholder="Dia do mês"
        required
        className="w-full p-2 border rounded"
        disabled={isEditing && formData.fixed}
      />

      <input
        name="amount"
        type="number"
        min={0.01}
        step={0.01}
        value={formData.amount}
        onChange={handleChange}
        placeholder="Valor"
        required
        className="w-full p-2 border rounded"
      />

      <select
        name="paymentMethod"
        value={formData.paymentMethod}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Forma de pagamento</option>
        <option value="dinheiro">Dinheiro</option>
        <option value="cartão de débito">Cartão de Débito</option>
        <option value="cartão de crédito">Cartão de Crédito</option>
        <option value="pix">Pix</option>
        <option value="boleto">Boleto</option>
        <option value="transferência">Transferência</option>
        <option value="outro">Outro</option>
      </select>

      {formData.paymentMethod === "cartão de crédito" && (
        <>
          <input
            name="installments"
            type="number"
            min={1}
            step={1}
            value={formData.installments || ""}
            onChange={handleChange}
            placeholder="Parcelas"
            required
            className="w-full p-2 border rounded"
          />
          <select
            name="creditCardId"
            value={formData.creditCardId ?? ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione um cartão</option>
            {creditCards.map((card) => (
              <option key={card._id} value={card._id}>
                {card.name} •••• {card.lastDigits}
              </option>
            ))}
          </select>
        </>
      )}

      <input
        name="note"
        value={formData.note}
        onChange={handleChange}
        placeholder="Observação (opcional)"
        className="w-full p-2 border rounded"
      />

      <label className="flex gap-2 items-center mt-2">
        <input
          type="checkbox"
          name="fixed"
          checked={!!formData.fixed}
          onChange={handleChange}
          className="accent-blue-500"
          disabled={isEditing}
        />
        Gasto recorrente (fixo)
        {isEditing && (
          <span className="text-xs text-black">(Não editável)</span>
        )}
      </label>

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
            ? "Atualizar Despesa"
            : "Adicionar Despesa"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setFormData(defaultFormData);
              setIsEditing(false);
              onCancelEdit?.();
            }}
            disabled={isSubmitting}
            className="flex-1 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 transition"
          >
            Cancelar Edição
          </button>
        )}
      </div>
    </form>
  );
};
