"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useInvestments } from "@/contexts/InvestmentContext";
import { useDate } from "@/contexts/DateContext";
import { Investment } from "@/interfaces/Investment";
import { Modal } from "@/components/Modal";
import { MonthSelect } from "@/components/MonthSelect";
import { YearSelector } from "@/components/YearSelector";
import InvestmentForm from "@/components/InvestmentForm";
import { InvestmentSummary } from "@/components/InvestmentSummary";
import { deleteInvestment } from "@/services/investmentService";
import InvestmentInfoPanel from "../../components/InvestmentInfoPanel";
import MacroEconomyCard from "../../components/MacroEconomyCard";
import TopStockCard from "../../components/TopStockCard";
import { Plus } from "lucide-react";

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
    <main className="w-full bg-gray-50 text-black px-6 py-8 flex flex-col items-center gap-4 h-screen">
      <div className="flex flex-col self-start mb-2">
        <h1 className="text-xl lg:text-4xl font-extrabold mt-12 lg:mt-2">
          Investimentos
        </h1>
        <span className="text-sm text-gray-600">
          Gerencie suas investimentos aqui
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center lg:items-end gap-4 lg:justify-between w-full">
        <div className="flex gap-4 lg:w-[50%]">
          <YearSelector />
          <MonthSelect />
        </div>

        <div className="flex gap-4 mt-4 flex-wrap">
          <button
            className="bg-blue-600 w-full lg:w-60 px-4 py-3 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => openModal()}
          >
            <Plus></Plus>
            Novo Investimento
          </button>
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

      <div className="w-full flex flex-col lg:flex lg:flex-row items-center gap-6">
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
