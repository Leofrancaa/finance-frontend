"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useFetchIncomes } from "@/hooks/usefetchIncomes";

import { Income } from "@/interfaces/Income";
import { Modal } from "@/components/Modal";
import IncomeForm from "@/components/IncomeForm";
import { IncomeDashboard } from "@/components/IncomeDashboard";
import IncomeCategoryManagerForm from "@/components/IncomeCategoryForm";
import { MonthSelect } from "@/components/MonthSelect";
import { YearSelector } from "@/components/YearSelector";
import {
  AlertThresholdProvider,
  CategoryProvider,
  CreditCardProvider,
  FancyButton,
} from "../despesas/importsDespesas";

export default function ReceitasPage() {
  const router = useRouter();
  const { user } = useUser();
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

  return (
    <AlertThresholdProvider>
      <CreditCardProvider>
        <CategoryProvider>
          <main className="w-full bg-gray-50 text-black p-6 flex flex-col items-center gap-6 h-[100vh]">
            {/* Sair */}

            <h1 className="text-2xl font-bold text-center">
              Gerenciador de Receitas
            </h1>

            <div className="flex justify-between w-full">
              <div className="flex gap-4">
                <YearSelector />
                <MonthSelect />
              </div>

              <div className="flex gap-4 mt-4">
                <FancyButton onClick={() => openIncomeModal()}>
                  Adicionar Receita
                </FancyButton>
                <FancyButton onClick={() => setShowIncomeCategoryModal(true)}>
                  Categorias de Receita
                </FancyButton>
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

            {/* Modal de Categorias de Receita */}
            <Modal
              isOpen={showIncomeCategoryModal}
              onClose={() => setShowIncomeCategoryModal(false)}
            >
              <IncomeCategoryManagerForm
                onSaveSuccess={() => setShowIncomeCategoryModal(false)}
              />
            </Modal>

            {/* Dashboard de Receitas */}
            <div className="w-full mt-6">
              <IncomeDashboard onEdit={(i) => openIncomeModal(i)} />
            </div>
          </main>
        </CategoryProvider>
      </CreditCardProvider>
    </AlertThresholdProvider>
  );
}
