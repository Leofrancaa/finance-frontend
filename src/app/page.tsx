"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExpenseForm from "@/components/ExpenseForm";
import IncomeForm from "@/components/IncomeForm";
import { Modal } from "@/components/Modal";
import { MonthSelect } from "@/components/MonthSelect";
import { YearSelector } from "@/components/YearSelector";
import { useUser } from "@/contexts/UserContext";
import { AlertThresholdProvider } from "@/contexts/AlertThresholdContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { CreditCardProvider } from "@/contexts/CreditCardContext";
import { useFetchExpenses } from "@/hooks/useFetchExpenses";
import { useFetchIncomes } from "@/hooks/usefetchIncomes";
import { Expense } from "@/interfaces/Expense";
import { Income } from "@/interfaces/Income";
import FancyButton from "../components/ClickButton";
import ExpensesCard from "../components/ExpensesCard";

import IncomesCard from "../components/IncomesCard";
import CryptoInvestmentCard from "../components/CryptoInvestmentCard";

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  useFetchExpenses();
  useFetchIncomes();

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const openModal = (type: "despesa" | "receita", item?: Expense | Income) => {
    if (type === "despesa") {
      setEditingExpense((item as Expense) ?? null);
      setExpenseModalOpen(true);
    } else {
      setEditingIncome((item as Income) ?? null);
      setIncomeModalOpen(true);
    }
  };

  const closeExpenseModal = () => {
    setEditingExpense(null);
    setExpenseModalOpen(false);
  };

  const closeIncomeModal = () => {
    setEditingIncome(null);
    setIncomeModalOpen(false);
  };

  return (
    <AlertThresholdProvider>
      <CreditCardProvider>
        <CategoryProvider>
          <main className="w-full max-w-screen overflow-x-hidden bg-gray-100 text-black py-6 flex flex-col items-center gap-6 mt-20 min-h-screen">
            <h1 className="text-2xl font-bold mt">Dashboard</h1>

            <div className="flex justify-between w-[96vw]">
              <div className="flex gap-4">
                <YearSelector />
                <MonthSelect />
              </div>

              <div className="flex gap-4 mt-4">
                <FancyButton onClick={() => openModal("receita")}>
                  Adicionar Receita
                </FancyButton>
                <FancyButton onClick={() => openModal("despesa")}>
                  Nova Despesa
                </FancyButton>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex justify-between w-[96vw]">
                <ExpensesCard></ExpensesCard>
                <IncomesCard></IncomesCard>
              </div>
              <CryptoInvestmentCard></CryptoInvestmentCard>
            </div>

            {/* Modal de Despesa */}
            <Modal isOpen={expenseModalOpen} onClose={closeExpenseModal}>
              <ExpenseForm
                expenseToEdit={editingExpense}
                onCancelEdit={closeExpenseModal}
                onExpenseUpdated={closeExpenseModal}
              />
            </Modal>

            {/* Modal de Receita */}
            <Modal isOpen={incomeModalOpen} onClose={closeIncomeModal}>
              <IncomeForm
                incomeToEdit={editingIncome}
                onCancelEdit={closeIncomeModal}
                onIncomeUpdated={closeIncomeModal}
              />
            </Modal>
          </main>
        </CategoryProvider>
      </CreditCardProvider>
    </AlertThresholdProvider>
  );
}
