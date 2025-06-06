"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import { Expense } from "@/interfaces/Expense";
import { useCategory } from "@/contexts/CategoryContext";
import { useCreditCards } from "@/contexts/CreditCardContext";
import { useExpenses } from "@/contexts/ExpensesContext";
import {
  postExpenseToAPI,
  transformAddExpenseData,
  updateExpenseInAPI,
} from "@/services/expenseService";
import {
  buildRecurringPayload,
  postRecurringExpense,
} from "@/services/recurringService";
import { getUserIdFromToken } from "@/utils/auth";

interface ExpenseFormProps {
  expenseToEdit?: Expense | null;
  onCancelEdit?: () => void;
  onExpenseUpdated?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expenseToEdit = null,
  onCancelEdit,
  onExpenseUpdated,
}) => {
  const { categories } = useCategory();
  const { cards: creditCards } = useCreditCards();
  const { addExpense, updateExpense } = useExpenses();

  const [formData, setFormData] = useState({
    date: "",
    type: "",
    subtype: "",
    amount: "",
    paymentType: "",
    installments: "",
    creditCard: "",
    description: "",
    isFixed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (expenseToEdit) {
      const expenseDate = new Date(expenseToEdit.date);
      const isoDate = expenseDate.toISOString().split("T")[0];
      setFormData({
        date: isoDate,
        type: expenseToEdit.type || "",
        subtype: expenseToEdit.subcategory || "",
        amount: expenseToEdit.amount.toString(),
        paymentType: expenseToEdit.paymentMethod || "",
        installments: expenseToEdit.installments?.toString() || "",
        creditCard: expenseToEdit.creditCardId || "",
        description: expenseToEdit.note || "",
        isFixed: expenseToEdit.fixed || false,
      });
    }
  }, [expenseToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { type, amount, date, paymentType } = formData;

    if (!type || !amount || !date || !paymentType) {
      alert("Preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = getUserIdFromToken();
      const parsedDate = new Date(formData.date);

      const expenseData = transformAddExpenseData({
        type: formData.type,
        amount: formData.amount,
        date: formData.date,
        note: formData.description,
        paymentMethod: formData.paymentType,
        subcategory: formData.subtype,
        fixed: formData.isFixed,
        installments: formData.installments,
        creditCardId: formData.creditCard,
      });

      const payload = {
        ...expenseData,
        userId,
      } as Expense & { userId?: string };

      if (expenseToEdit) {
        const updated = await updateExpenseInAPI(
          expenseToEdit._id!,
          expenseData
        );
        updateExpense(updated);
        alert("Despesa atualizada com sucesso!");
      } else {
        if (formData.isFixed) {
          const recurring = buildRecurringPayload(
            {
              type: formData.type,
              amount: formData.amount,
              paymentMethod: formData.paymentType,
              installments: formData.installments,
              note: formData.description,
              fixed: formData.isFixed,
              subcategory: formData.subtype,
              creditCardId: formData.creditCard,
              date: formData.date,
            },
            parsedDate.getFullYear(),
            parsedDate.getMonth()
          );

          await postRecurringExpense({ ...recurring, fixed: true });

          for (let m = parsedDate.getMonth(); m < 12; m++) {
            const newExpense = {
              ...expenseData,
              date: `${parsedDate.getFullYear()}-${String(m + 1).padStart(
                2,
                "0"
              )}-${String(parsedDate.getDate()).padStart(2, "0")}`,
              fixed: true,
              userId,
            } as Expense & { userId?: string };

            const saved = await postExpenseToAPI(newExpense);
            addExpense(saved);
          }
        } else {
          const saved = await postExpenseToAPI(payload);
          addExpense(saved);
        }

        alert("Despesa adicionada com sucesso!");
      }

      setFormData({
        date: "",
        type: "",
        subtype: "",
        amount: "",
        paymentType: "",
        installments: "",
        creditCard: "",
        description: "",
        isFixed: false,
      });

      onExpenseUpdated?.();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar a despesa.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentTypeOptions = [
    { value: "dinheiro", label: "Dinheiro" },
    { value: "debito", label: "Débito" },
    { value: "credito", label: "Crédito" },
    { value: "pix", label: "PIX" },
    { value: "boleto", label: "Boleto" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-opacity-30 flex justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-3xl shadow-lg my-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Nova Despesa</h2>
          <button
            onClick={onCancelEdit}
            className="text-gray-500 hover:text-black text-2xl leading-none"
            type="button"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="amount"
              label="Valor *"
              type="number"
              required
              value={formData.amount}
              onChange={handleChange}
            />
            <Select
              id="type"
              label="Categoria *"
              required
              options={categories
                .filter((cat) => !cat.isIncome) // <-- só despesas
                .map((cat) => ({
                  value: cat.name,
                  label: cat.name,
                }))}
              value={formData.type}
              onChange={handleChange}
            />

            <Select
              id="subtype"
              label="Subcategoria"
              options={
                categories
                  .find((cat) => cat.name === formData.type)
                  ?.subcategories.map((s) => ({
                    value: s,
                    label: s,
                  })) || []
              }
              value={formData.subtype}
              onChange={handleChange}
            />
            <Input
              id="date"
              label="Data *"
              type="date"
              required
              value={formData.date}
              onChange={handleChange}
            />
            <Select
              id="paymentType"
              label="Tipo de Pagamento *"
              required
              options={paymentTypeOptions}
              value={formData.paymentType}
              onChange={handleChange}
            />
            <Select
              id="creditCard"
              label="Cartão de crédito"
              options={creditCards.map((card) => ({
                value: card._id,
                label: `${card.name} (****${card.lastDigits})`,
              }))}
              value={formData.creditCard}
              onChange={handleChange}
            />
            <Input
              id="installments"
              label="Parcelas"
              type="number"
              value={formData.installments}
              onChange={handleChange}
            />
          </div>

          <div className="mt-2">
            <Input
              id="observation"
              label="Observação"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <Checkbox
            id="isFixed"
            label="Despesa fixa"
            checked={formData.isFixed}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
