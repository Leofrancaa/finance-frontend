"use client";

import { useState } from "react";
import FancyButton from "@/components/ClickButton";
import { Modal } from "@/components/Modal";
import CategoryManagerForm from "@/components/ExpenseCategoryForm"; // ajuste o caminho conforme sua estrutura
import { CategoryProvider } from "../despesas/importsDespesas";
import IncomeCategoryManagerForm from "@/components/IncomeCategoryForm";

export default function CategoriaPage() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showIncomeCategoryModal, setShowIncomeCategoryModal] = useState(false);

  return (
    <CategoryProvider>
      <div className="w-full min-h-screen bg-gray-50 px-4 py-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Categorias de Despesas
        </h1>

        {/* Botão para abrir o modal */}
        <FancyButton onClick={() => setShowCategoryModal(true)}>
          Gerenciar Categorias
        </FancyButton>
        <FancyButton onClick={() => setShowIncomeCategoryModal(true)}>
          Categorias de Receita
        </FancyButton>

        {/* Modal de categorias */}
        <Modal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
        >
          <CategoryManagerForm
            onSaveSuccess={() => setShowCategoryModal(false)}
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
      </div>
    </CategoryProvider>
  );
}
