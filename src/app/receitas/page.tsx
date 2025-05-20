"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useDate } from "@/contexts/DateContext";
import { useIncomes } from "@/contexts/IncomesContext";
import { useFetchIncomes } from "@/hooks/usefetchIncomes";

import { Income } from "@/interfaces/Income";
import { Modal } from "@/components/Modal";
import { IncomeForm } from "@/components/IncomeForm";
import { IncomeDashboard } from "@/components/IncomeDashboard";
import IncomeCategoryManagerForm from "@/components/IncomeCategoryForm";
import { MonthSelect } from "@/components/MonthSelect";
import { YearSelector } from "@/components/YearSelector";
import { formattedSaldo } from "@/components/UserInfo";

export default function ReceitasPage() {
  const router = useRouter();
  const { user, logout } = useUser();
  const { selectedMonth, selectedYear } = useDate();
  const { incomes } = useIncomes();
  useFetchIncomes();

  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showIncomeCategoryModal, setShowIncomeCategoryModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const openIncomeModal = (income?: Income) => {
    setEditingIncome(income ?? null);
    setShowIncomeModal(true);
  };

  const closeIncomeModal = () => {
    setEditingIncome(null);
    setShowIncomeModal(false);
  };

  const totalReceitas = incomes
    .filter((i) => {
      const d = new Date(i.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    })
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <main className="w-full bg-gray-200 text-black p-6 flex flex-col items-center gap-6">
      {/* Sair */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Sair
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center">
        Gerenciador de Receitas
      </h1>

      <YearSelector />
      <div className="w-[90vw]">
        <MonthSelect />
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => openIncomeModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nova Receita
        </button>
        <button
          onClick={() => setShowIncomeCategoryModal(true)}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Categorias de Receita
        </button>
      </div>

      {/* Modal de Receita */}
      <Modal isOpen={showIncomeModal} onClose={closeIncomeModal}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editingIncome ? "Editar Receita" : "Nova Receita"}
          </h2>
        </div>
        <IncomeForm
          incomeToEdit={editingIncome}
          onCancelEdit={closeIncomeModal}
          onIncomeUpdated={closeIncomeModal}
        />
      </Modal>

      {/* Modal de Categorias de Receita */}
      <Modal
        isOpen={showIncomeCategoryModal}
        onClose={() => setShowIncomeCategoryModal(false)}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gerenciar Categorias de Receita</h2>
        </div>
        <IncomeCategoryManagerForm />
      </Modal>

      {/* Dashboard de Receitas */}
      <div className="w-full mt-6">
        <IncomeDashboard onEdit={(i) => openIncomeModal(i)} />
      </div>

      <div className="my-4 p-4 bg-gray-100 rounded border text-lg font-bold">
        Total de receitas no mês:{" "}
        <span className="text-green-600">
          R$ {formattedSaldo(totalReceitas)}
        </span>
      </div>
    </main>
  );
}
