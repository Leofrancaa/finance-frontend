import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import { Expense } from "@/interfaces/Expense";
import { useDate } from "@/contexts/DateContext";
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
import { MONTHS } from "@/utils/constants";

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
  const { selectedMonth, setMonth, selectedYear } = useDate();
  const { categories } = useCategory();
  const { cards: creditCards } = useCreditCards();
  const { addExpense, updateExpense } = useExpenses();

  const [formData, setFormData] = useState({
    day: "",
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
      setFormData({
        day: expenseDate.getDate().toString(),
        type: expenseToEdit.type || "",
        subtype: expenseToEdit.subcategory || "",
        amount: expenseToEdit.amount.toString(),
        paymentType: expenseToEdit.paymentMethod || "",
        installments: expenseToEdit.installments?.toString() || "",
        creditCard: expenseToEdit.creditCardId || "",
        description: expenseToEdit.note || "",
        isFixed: expenseToEdit.fixed || false,
      });
      setMonth(expenseDate.getMonth());
    }
  }, [expenseToEdit, setMonth]);

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

    const { type, amount, day, paymentType } = formData;

    if (!type || !amount || !day || !paymentType) {
      alert("Preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = getUserIdFromToken();

      const expenseData = transformAddExpenseData(
        {
          type: formData.type,
          amount: formData.amount,
          day: formData.day,
          note: formData.description,
          paymentMethod: formData.paymentType,
          subcategory: formData.subtype,
          fixed: formData.isFixed,
          installments: formData.installments,
          creditCardId: formData.creditCard,
        },
        selectedYear,
        selectedMonth
      );

      const payload = {
        ...expenseData,
        userId,
      } as Expense & { userId?: string };

      if (expenseToEdit) {
        if (!expenseToEdit._id) throw new Error("ID não encontrado.");
        const updated = await updateExpenseInAPI(
          expenseToEdit._id,
          expenseData
        );
        updateExpense(updated);
        alert("Despesa atualizada com sucesso!");
      } else {
        if (formData.isFixed) {
          const recurring = buildRecurringPayload(
            {
              ...formData,
              note: formData.description,
              paymentMethod: formData.paymentType,
              subcategory: formData.subtype,
              creditCardId: formData.creditCard,
            },
            selectedYear,
            selectedMonth
          );

          await postRecurringExpense({
            ...recurring,
            fixed: true,
          });

          for (let m = selectedMonth; m < 12; m++) {
            const newExpense = {
              ...expenseData,
              date: new Date(
                selectedYear,
                m,
                parseInt(formData.day)
              ).toISOString(),
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
        day: "",
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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="mb-6 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Cadastro de Despesas
        </h2>
        <p className="text-gray-600">Preencha os dados da sua despesa</p>
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

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="month"
            label="Mês"
            options={MONTHS.map((label, index) => ({
              value: index.toString(),
              label,
            }))}
            required
            value={selectedMonth.toString()}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
          <Input
            id="day"
            label="Dia do mês"
            type="number"
            placeholder="1-31"
            required
            value={formData.day}
            onChange={handleChange}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="type"
            label="Tipo"
            options={categories.map((cat) => ({
              value: cat.name,
              label: cat.name,
            }))}
            required
            value={formData.type}
            onChange={handleChange}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 5a2 2 0 012-2h3a1 1 0 010 2H4v10h3a1 1 0 110 2H4a2 2 0 01-2-2V5zm11-1a1 1 0 000 2h3v10h-3a1 1 0 100 2h3a2 2 0 002-2V5a2 2 0 00-2-2h-3z" />
              </svg>
            }
          />
          <Select
            id="subtype"
            label="Subtipo"
            options={
              categories
                .find((cat) => cat.name === formData.type)
                ?.subcategories.map((s) => ({ value: s, label: s })) || []
            }
            value={formData.subtype}
            onChange={handleChange}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 3a1 1 0 00-1 1v2a1 1 0 102 0V5h10v1a1 1 0 102 0V4a1 1 0 00-1-1H4zm0 6a1 1 0 00-1 1v2a1 1 0 102 0v-1h10v1a1 1 0 102 0v-2a1 1 0 00-1-1H4zm-1 6a1 1 0 100 2h14a1 1 0 100-2H3z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="amount"
            label="Valor (R$)"
            type="number"
            placeholder="0,00"
            required
            value={formData.amount}
            onChange={handleChange}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <Select
            id="paymentType"
            label="Tipo de pagamento"
            options={paymentTypeOptions}
            required
            value={formData.paymentType}
            onChange={handleChange}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm14 4H2v6a2 2 0 002 2h12a2 2 0 002-2V8z" />
              </svg>
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="creditCard"
            label="Cartão de crédito"
            options={creditCards.map((card) => ({
              value: card._id,
              label: `${card.name} (****${card.lastDigits})`,
            }))}
            value={formData.creditCard}
            onChange={handleChange}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2H2V5zm0 4h16v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9zm2 2a1 1 0 000 2h2a1 1 0 100-2H4z" />
              </svg>
            }
          />
          <Input
            id="installments"
            label="Quantidade de parcelas"
            type="number"
            placeholder="1"
            value={formData.installments}
            onChange={handleChange}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
                <path d="M11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            }
          />
        </div>

        <Input
          id="description"
          label="Descrição"
          placeholder="Descreva sua despesa"
          value={formData.description}
          onChange={handleChange}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <Checkbox
          id="isFixed"
          label="É um gasto fixo?"
          checked={formData.isFixed}
          onChange={handleChange}
        />

        <div className="pt-4 flex flex-col md:flex-row gap-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar despesa"}
          </Button>

          {expenseToEdit && (
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onCancelEdit}
            >
              Cancelar edição
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
