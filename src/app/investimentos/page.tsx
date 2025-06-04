"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useInvestments } from "@/contexts/InvestmentContext";
import { useDate } from "@/contexts/DateContext";
import { Investment } from "@/interfaces/Investment";
import { Modal } from "@/components/Modal";
import FancyButton from "@/components/Button";
import { MonthSelect } from "@/components/MonthSelect";
import { YearSelector } from "@/components/YearSelector";
import InvestmentForm from "@/components/InvestmentForm";
import { InvestmentSummary } from "@/components/InvestmentSummary";
import { deleteInvestment } from "@/services/investmentService";
import InvestmentInfoPanel from "../../components/InvestmentInfoPanel";
import MacroEconomyCard from "../../components/MacroEconomyCard";
import TopStockCard from "../../components/TopStockCard";

export default function InvestimentosPage() {
  const router = useRouter();
  const { user } = useUser();
  const { investments, fetchInvestments, removeInvestment } = useInvestments();
  const { selectedMonth, selectedYear } = useDate();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(
    null
  );

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const openModal = (investment?: Investment) => {
    setEditingInvestment(investment ?? null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingInvestment(null);
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteInvestment(id);
    removeInvestment(id);
  };

  return (
    <main className="w-full bg-gray-200 text-black px-6 py-8 flex flex-col items-center gap-6 mt-20 h-screen">
      <h1 className="text-2xl font-bold">Gerenciador de Investimentos</h1>

      <div className="flex justify-between w-full">
        <div className="flex gap-4">
          <YearSelector />
          <MonthSelect />
        </div>

        <div className="flex gap-4 mt-4 flex-wrap">
          <FancyButton onClick={() => openModal()}>
            Novo Investimento
          </FancyButton>
        </div>
      </div>

      {/* Modal de cadastro/edição */}
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <InvestmentForm
          investmentToEdit={editingInvestment}
          onCancelEdit={closeModal}
          onInvestmentUpdated={() => {
            fetchInvestments();
            closeModal();
          }}
        />
      </Modal>

      <div className="w-full flex items-center gap-6">
        <MacroEconomyCard></MacroEconomyCard>
        <TopStockCard></TopStockCard>
        <InvestmentInfoPanel></InvestmentInfoPanel>
      </div>

      {/* Lista de investimentos */}
      <div className="w-full mt-6">
        <InvestmentSummary
          investments={investments}
          year={selectedYear}
          month={selectedMonth}
          onDelete={handleDelete}
          onEdit={(inv) => openModal(inv)}
        />
      </div>
    </main>
  );
}
