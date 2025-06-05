"use client";

import { useState } from "react";
import FancyButton from "@/components/ClickButton";
import { Modal } from "@/components/Modal";
import CreditCardForm from "@/components/CreditCardForm"; // ajuste conforme a estrutura do seu projeto
import { CreditCardProvider } from "@/contexts/CreditCardContext";

export default function CartaoCreditoPage() {
  const [showCardModal, setShowCardModal] = useState(false);

  return (
    <CreditCardProvider>
      <div className="w-full min-h-screen bg-gray-50 px-4 py-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Cartões de Crédito
        </h1>

        {/* Botão para abrir modal */}
        <FancyButton onClick={() => setShowCardModal(true)}>
          Cartões de Crédito
        </FancyButton>

        {/* Modal com formulário */}

        <Modal isOpen={showCardModal} onClose={() => setShowCardModal(false)}>
          <CreditCardForm onClose={() => setShowCardModal(false)} />
        </Modal>
      </div>
    </CreditCardProvider>
  );
}
