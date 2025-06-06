"use client";

import { useState } from "react";
import FancyButton from "@/components/ClickButton";
import { Modal } from "@/components/Modal";
import CategoryManagerForm from "@/components/ExpenseCategoryForm";
import { CategoryProvider } from "../despesas/importsDespesas";
import { useCategory } from "../../contexts/CategoryContext";
import IncomeCategoryManagerForm from "@/components/IncomeCategoryForm";
import CategoryCard from "@/components/CategoryCard";
import { Category } from "../../contexts/CategoryContext";
import { deleteCategoryAPI } from "@/services/categoryService";
import { getUserIdFromToken } from "@/utils/auth";

export default function CategoriaPage() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showIncomeCategoryModal, setShowIncomeCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <CategoryProvider>
      <CategoriaContent
        showCategoryModal={showCategoryModal}
        setShowCategoryModal={setShowCategoryModal}
        showIncomeCategoryModal={showIncomeCategoryModal}
        setShowIncomeCategoryModal={setShowIncomeCategoryModal}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
      />
    </CategoryProvider>
  );
}

function CategoriaContent({
  showCategoryModal,
  setShowCategoryModal,
  showIncomeCategoryModal,
  setShowIncomeCategoryModal,
  editingCategory,
  setEditingCategory,
}: {
  showCategoryModal: boolean;
  setShowCategoryModal: (value: boolean) => void;
  showIncomeCategoryModal: boolean;
  setShowIncomeCategoryModal: (value: boolean) => void;
  editingCategory: Category | null;
  setEditingCategory: (cat: Category | null) => void;
}) {
  const { categories, setCategories } = useCategory();

  const handleDeleteCategory = async (category: Category) => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      await deleteCategoryAPI(userId, category.name);
      const updated = categories.filter((c) => c.name !== category.name);
      setCategories(updated);
    } catch (error) {
      alert("Erro ao deletar categoria.");
      console.error(error);
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setShowCategoryModal(true);
  };

  const closeModal = () => {
    setEditingCategory(null);
    setShowCategoryModal(false);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-8 flex flex-col items-center gap-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
        Categorias de Despesas
      </h1>

      <FancyButton onClick={() => setShowCategoryModal(true)}>
        Gerenciar Categorias
      </FancyButton>
      <FancyButton onClick={() => setShowIncomeCategoryModal(true)}>
        Categorias de Receita
      </FancyButton>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full max-w-6xl">
        {categories.map((cat: Category) => (
          <CategoryCard
            key={cat.name}
            category={cat}
            onEdit={handleEditCategory}
            onDelete={() => handleDeleteCategory(cat)}
          />
        ))}
      </div>

      <Modal isOpen={showCategoryModal} onClose={closeModal}>
        <CategoryManagerForm
          editingCategory={editingCategory}
          onSaveSuccess={closeModal}
        />
      </Modal>

      <Modal
        isOpen={showIncomeCategoryModal}
        onClose={() => setShowIncomeCategoryModal(false)}
      >
        <IncomeCategoryManagerForm
          onSaveSuccess={() => setShowIncomeCategoryModal(false)}
        />
      </Modal>
    </div>
  );
}
