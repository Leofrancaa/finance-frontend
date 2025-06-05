"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useFetchIncomes } from "@/hooks/usefetchIncomes";

import { Income } from "@/interfaces/Income";
import { Modal } from "@/components/Modal";
import IncomeForm from "@/components/IncomeForm";
import { IncomeDashboard } from "@/components/IncomeDashboard";

import { MonthSelect } from "@/components/MonthSelect";
import { YearSelector } from "@/components/YearSelector";
import {
  AlertThresholdProvider,
  CategoryProvider,
  CreditCardProvider,
} from "../despesas/importsDespesas";
import { Plus } from "lucide-react";

export default function ReceitasPage() {
  const router = useRouter();
  const { user } = useUser();
  useFetchIncomes();

  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

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

  return (
    <AlertThresholdProvider>
      <CreditCardProvider>
        <CategoryProvider>
          <main className="w-full bg-gray-50 text-black p-6 flex flex-col items-center gap-4 h-[100vh]">
            {/* Sair */}

            <div className="flex flex-col self-start mb-4">
              <h1 className="text-xl lg:text-4xl font-extrabold mt-12 lg:mt-2">
                Receitas
              </h1>
              <span className="text-sm text-gray-600">
                Gerencie suas receitas aqui
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center lg:items-end gap-4 lg:justify-between w-full">
              <div className="flex gap-4 lg:w-[50%]">
                <YearSelector />
                <MonthSelect />
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  className="bg-blue-600 w-full lg:w-60 px-4 py-3 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => openIncomeModal()}
                >
                  <Plus></Plus>
                  Nova Receita
                </button>
              </div>
            </div>

            {/* Modal de Receita */}
            <Modal isOpen={showIncomeModal} onClose={closeIncomeModal}>
              <IncomeForm
                incomeToEdit={editingIncome}
                onCancelEdit={closeIncomeModal}
                onIncomeUpdated={closeIncomeModal}
              />
            </Modal>

            {/* Dashboard de Receitas */}
            <div className="w-full mt-4">
              <IncomeDashboard onEdit={(i) => openIncomeModal(i)} />
            </div>
          </main>
        </CategoryProvider>
      </CreditCardProvider>
    </AlertThresholdProvider>
  );
}
