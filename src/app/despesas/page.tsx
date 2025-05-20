"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExpenseForm } from "@/components/ExpenseForm";
import { Modal } from "@/components/Modal";
import { MonthSelect } from "@/components/MonthSelect";
import { YearSelector } from "@/components/YearSelector";
import { ExpenseSummary } from "@/components/ExpenseSummary";
import { CalendarView } from "@/components/CalendarView";
import { ExpenseByTypeChart } from "@/components/ExpenseByTypeChart";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { AlertThresholdForm } from "@/components/AlertsForm";
import CategoryManagerForm from "@/components/ExpenseCategoryForm";
import CreditCardForm from "@/components/CreditCardForm";

import { useExpenses } from "@/contexts/ExpensesContext";
import { useDate } from "@/contexts/DateContext";
import { useUser } from "@/contexts/UserContext";
import { AlertThresholdProvider } from "@/contexts/AlertThresholdContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { CreditCardProvider } from "@/contexts/CreditCardContext";
import { useFetchExpenses } from "@/hooks/useFetchExpenses";
import { Expense } from "@/interfaces/Expense";
import { formattedSaldo } from "@/components/UserInfo";

export default function DespesasPage() {
  const { user } = useUser();
  const router = useRouter();

  const { selectedMonth, selectedYear } = useDate();
  const { expenses, deleteExpense } = useExpenses();
  useFetchExpenses();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  const openExpenseModal = (expense?: Expense) => {
    setEditingExpense(expense ?? null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingExpense(null);
    setModalOpen(false);
  };

  const totalDespesas = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <AlertThresholdProvider>
      <CreditCardProvider>
        <CategoryProvider>
          <main className="w-full bg-gray-200 text-black p-6 flex flex-col items-center gap-6 mt-20">
            <h1 className="text-2xl font-bold">Gerenciador de Despesas</h1>
            <div className="flex gap-4">
              <YearSelector />
              <MonthSelect />
            </div>

            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={() => openExpenseModal()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Nova Despesa
              </button>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Gerenciar Categorias
              </button>
              <button
                onClick={() => setShowAlertModal(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Alertas de Gasto
              </button>
              <button
                onClick={() => setShowCardModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Cartões de Crédito
              </button>
            </div>

            {/* Modal de despesa */}
            <Modal isOpen={modalOpen} onClose={closeModal}>
              <div className="mb-4">
                <h2 className="text-xl font-bold">
                  {editingExpense ? "Editar Despesa" : "Nova Despesa"}
                </h2>
              </div>

              {/* Aqui você adiciona o seletor de mês */}
              <div className="mb-4">
                <MonthSelect />
              </div>

              <ExpenseForm
                expenseToEdit={editingExpense}
                onCancelEdit={closeModal}
                onExpenseUpdated={closeModal}
              />
            </Modal>

            {/* Modal de categorias */}
            <Modal
              isOpen={showCategoryModal}
              onClose={() => setShowCategoryModal(false)}
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold">Gerenciar Categorias</h2>
              </div>
              <CategoryManagerForm
                onSaveSuccess={() => setShowCategoryModal(false)}
              />
            </Modal>

            {/* Modal de alertas */}
            <Modal
              isOpen={showAlertModal}
              onClose={() => setShowAlertModal(false)}
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold">Alertas de Gasto</h2>
              </div>
              <AlertThresholdForm
                onSaveSuccess={() => setShowAlertModal(false)}
              />
            </Modal>

            {/* Modal de cartões */}
            <Modal
              isOpen={showCardModal}
              onClose={() => setShowCardModal(false)}
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold">Gerenciar Cartões</h2>
              </div>
              <CreditCardForm />
            </Modal>

            {/* Lista de despesas */}
            <div className="w-full mt-6">
              <ExpenseSummary
                expenses={expenses}
                year={selectedYear}
                month={selectedMonth}
                onDelete={deleteExpense}
                onEdit={(e) => openExpenseModal(e)}
              />
            </div>

            <div className="my-4 p-4 bg-gray-100 rounded border text-lg font-bold">
              Total de despesas no mês:{" "}
              <span className="text-red-600">
                R$ {formattedSaldo(totalDespesas)}
              </span>
            </div>

            {/* Visuais */}
            <CalendarView />
            <ExpenseByTypeChart />
            <MonthlyExpensesChart />
          </main>
        </CategoryProvider>
      </CreditCardProvider>
    </AlertThresholdProvider>
  );
}
