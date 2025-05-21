"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExpenseForm } from "@/components/ExpenseForm";
import { IncomeForm } from "@/components/IncomeForm";
import { Modal } from "@/components/Modal";
import { MonthSelect } from "@/components/MonthSelect";
import { YearSelector } from "@/components/YearSelector";
import { useExpenses } from "@/contexts/ExpensesContext";
import { useIncomes } from "@/contexts/IncomesContext";
import { useDate } from "@/contexts/DateContext";
import { useUser } from "@/contexts/UserContext";
import { AlertThresholdProvider } from "@/contexts/AlertThresholdContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { CreditCardProvider } from "@/contexts/CreditCardContext";
import { useFetchExpenses } from "@/hooks/useFetchExpenses";
import { useFetchIncomes } from "@/hooks/usefetchIncomes";
import { Expense } from "@/interfaces/Expense";
import { Income } from "@/interfaces/Income";
import { formattedSaldo } from "@/components/UserInfo";
import ExpensesVsIncomesChart from "@/components/ExpenseVsIncomesChart";

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  useFetchExpenses();
  useFetchIncomes();

  const { selectedMonth, selectedYear } = useDate();
  const { expenses } = useExpenses();
  const { incomes } = useIncomes();

  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState<"despesa" | "receita">("despesa");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const openModal = (type: "despesa" | "receita", item?: Expense | Income) => {
    setFormType(type);
    setEditingExpense(type === "despesa" ? (item as Expense) ?? null : null);
    setEditingIncome(type === "receita" ? (item as Income) ?? null : null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingExpense(null);
    setEditingIncome(null);
    setModalOpen(false);
  };

  const totalDespesas = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const totalReceitas = incomes
    .filter((i) => {
      const d = new Date(i.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    })
    .reduce((sum, i) => sum + i.amount, 0);

  const saldoMes = totalReceitas - totalDespesas;

  return (
    <AlertThresholdProvider>
      <CreditCardProvider>
        <CategoryProvider>
          <main className="w-full bg-gray-100 text-black p-6 flex flex-col items-center gap-6 mt-20">
            <h1 className="text-2xl font-bold mt">Dashboard</h1>
            <div className="flex gap-4">
              <YearSelector />
              <MonthSelect />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => openModal("despesa")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Adicionar Despesas e Receitas
              </button>
            </div>

            <Modal isOpen={modalOpen} onClose={closeModal}>
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setFormType("receita")}
                  className={`px-4 py-2 font-medium border transition cursor-pointer ${
                    formType === "receita"
                      ? "bg-black text-white"
                      : "bg-white text-black border-black hover:bg-gray-100"
                  }`}
                >
                  Receitas
                </button>
                <button
                  onClick={() => setFormType("despesa")}
                  className={`px-4 py-2 font-medium border transition cursor-pointer ${
                    formType === "despesa"
                      ? "bg-black text-white"
                      : "bg-white text-black border-black hover:bg-gray-100"
                  }`}
                >
                  Despesas
                </button>
              </div>

              {/* Mês dentro do Modal */}
              <div className="mb-4">
                <MonthSelect />
              </div>

              {formType === "despesa" ? (
                <ExpenseForm
                  expenseToEdit={editingExpense}
                  onCancelEdit={closeModal}
                  onExpenseUpdated={closeModal}
                />
              ) : (
                <IncomeForm
                  incomeToEdit={editingIncome}
                  onCancelEdit={closeModal}
                  onIncomeUpdated={closeModal}
                />
              )}
            </Modal>
            <ExpensesVsIncomesChart />
            <div className="my-4 p-4 bg-gray-100 rounded border text-lg font-bold">
              Saldo do mês:{" "}
              <span
                className={saldoMes < 0 ? "text-red-600" : "text-green-600"}
              >
                R$ {formattedSaldo(saldoMes)}
              </span>
            </div>
          </main>
        </CategoryProvider>
      </CreditCardProvider>
    </AlertThresholdProvider>
  );
}
