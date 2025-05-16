"use client";

import { ExpenseForm } from "@/components/ExpenseForm";
import { IncomeForm } from "@/components/IncomeForm";
import { MonthButtons } from "@/components/MonthButtons";
import { YearSelector } from "@/components/YearSelector";
import { IncomeDashboard } from "@/components/IncomeDashboard";
import { ExpenseSummary } from "@/components/ExpenseSummary";
import { CalendarView } from "@/components/CalendarView";
import { ExpenseByTypeChart } from "@/components/ExpenseByTypeChart";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { AlertThresholdForm } from "@/components/AlertsForm";
import { AlertThresholdProvider } from "@/contexts/AlertThresholdContext";
import UserInfoAndBalance from "@/components/UserInfo"; // Adicionado import
import CategoryManagerForm from "@/components//ExpenseCategoryForm";
import IncomeCategoryManagerForm from "@/components/IncomeCategoryForm";
import CreditCardForm from "@/components/CreditCardForm";

import { useExpenses } from "@/contexts/ExpensesContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { CreditCardProvider } from "@/contexts/CreditCardContext";

import { useIncomes } from "@/contexts/IncomesContext";
import { useDate } from "@/contexts/DateContext";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react"; // Importa useRef
import { Expense } from "@/interfaces/Expense";
import { Income } from "@/interfaces/Income";

import { useFetchExpenses } from "@/hooks/useFetchExpenses";
import { useFetchIncomes } from "@/hooks/usefetchIncomes";

import { formattedSaldo } from "@/components/UserInfo";

export default function HomePage() {
  const { user, logout } = useUser();
  const router = useRouter();

  useFetchExpenses();
  useFetchIncomes();

  const { selectedMonth, selectedYear } = useDate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expenses, deleteExpense, updateExpense } = useExpenses();
  const {
    incomes,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteIncome: deleteIncomeContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateIncome,
  } = useIncomes();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Ref para a seção de formulários
  const formSectionRef = useRef<HTMLElement>(null);

  // 🔒 Proteção de rota
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  // Função para rolar para a seção de formulários
  const scrollToFormSection = () => {
    // Adiciona um pequeno delay para garantir que o estado foi atualizado antes do scroll
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100); // 100ms delay
  };

  // Funções de edição para Despesas
  const handleEditExpense = (expense: Expense) => {
    console.log("Iniciando edição da despesa:", expense);
    setEditingIncome(null);
    setEditingExpense(expense);
    scrollToFormSection(); // Chama a função de scroll
  };
  const handleCancelEditExpense = () => {
    setEditingExpense(null);
  };

  // Funções de edição para Receitas
  const handleEditIncome = (income: Income) => {
    console.log("Iniciando edição da receita:", income);
    setEditingExpense(null);
    setEditingIncome(income);
    scrollToFormSection(); // Chama a função de scroll
  };
  const handleCancelEditIncome = () => {
    setEditingIncome(null);
  };

  // Cálculos de totais e saldo (mantidos)
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
        {/* Contexto de Categorias */}
        <CategoryProvider>
          <main className="w-full bg-gray-200 text-black p-6 flex flex-col items-center justify-center gap-6">
            {/* Botão de Logout */}
            {user && (
              <div className="w-full flex justify-end p-2">
                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Sair
                </button>
              </div>
            )}
            <h1 className="text-2xl font-bold text-center">
              Gerenciador de Finanças
            </h1>
            <UserInfoAndBalance /> {/* Componente adicionado aqui */}
            <div className="flex-col">
              <YearSelector />
              <div className="w-[90vw]">
                <MonthButtons />
              </div>

              {/* Seção de Formulários - Adiciona a ref aqui */}
              <section
                ref={formSectionRef}
                id="form-section"
                className="mt-4 w-[90vw] flex flex-col md:flex-row gap-6"
              >
                {/* Formulário de Despesa */}
                <div className="w-full md:w-[45vw]">
                  <h2 className="text-xl font-semibold mb-2">
                    {editingExpense ? "Editar Despesa" : "Adicionar Despesa"}
                  </h2>
                  <ExpenseForm
                    expenseToEdit={editingExpense}
                    onCancelEdit={handleCancelEditExpense}
                    onExpenseUpdated={() => setEditingExpense(null)}
                  />
                </div>

                {/* Formulário de Receita */}
                <div className="w-full md:w-[45vw]">
                  <h2 className="text-xl font-semibold mb-2">
                    {editingIncome ? "Editar Receita" : "Adicionar Receita"}
                  </h2>
                  <IncomeForm
                    incomeToEdit={editingIncome}
                    onCancelEdit={handleCancelEditIncome}
                    onIncomeUpdated={() => setEditingIncome(null)}
                  />
                </div>
              </section>

              {/* Resumo de Despesas */}
              <div className="w-full mt-8">
                <ExpenseSummary
                  expenses={expenses}
                  year={selectedYear}
                  month={selectedMonth}
                  onDelete={deleteExpense}
                  onEdit={handleEditExpense}
                />
              </div>
            </div>
            {/* Dashboard de Receitas */}
            <div className="flex flex-col w-[90vw]">
              <IncomeDashboard onEdit={handleEditIncome} />
              {/* Saldo do Mês */}
              <div className="my-4 p-4 bg-gray-100 rounded border text-lg font-bold">
                Saldo do mês:{" "}
                <span
                  className={saldoMes < 0 ? "text-red-600" : "text-green-600"}
                >
                  R$ {formattedSaldo(saldoMes)}
                </span>
              </div>
            </div>
            {/* Outros Componentes */}
            <CalendarView />
            <ExpenseByTypeChart />
            <MonthlyExpensesChart />
            <div className="w-[90vw] my-8">
              <AlertThresholdForm />
            </div>
            <div className="w-[90vw] my-8">
              <CategoryManagerForm />
            </div>
            <div className="w-[90vw] my-8">
              <IncomeCategoryManagerForm />
            </div>
            <div className="w-[90vw] my-8">
              <CreditCardForm />
            </div>
          </main>
        </CategoryProvider>
      </CreditCardProvider>
    </AlertThresholdProvider>
  );
}
