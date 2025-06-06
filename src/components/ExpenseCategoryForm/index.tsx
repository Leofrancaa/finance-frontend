"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useCategory, Category } from "@/contexts/CategoryContext";

const colorOptions = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#a3e635",
  "#4ade80",
  "#34d399",
  "#2dd4bf",
  "#38bdf8",
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#c084fc",
  "#f472b6",
];

interface Props {
  onSaveSuccess?: () => void;
  editingCategory?: Category | null;
}

export default function CategoryManagerForm({
  onSaveSuccess,
  editingCategory,
}: Props) {
  const { categories, saveUserCategories, isLoading } = useCategory();

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [newSub, setNewSub] = useState<string>("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (editingCategory) {
      setCurrentCategory(editingCategory.name);
      setSelectedSubcategories(editingCategory.subcategories);
      setSelectedColor(editingCategory.color || colorOptions[0]);
    }
  }, [editingCategory]);

  const handleAddSubcategory = () => {
    const trimmed = newSub.trim();
    if (trimmed && !selectedSubcategories.includes(trimmed)) {
      setSelectedSubcategories([...selectedSubcategories, trimmed]);
      setNewSub("");
    }
  };

  const handleRemoveSubcategory = (sub: string) => {
    setSelectedSubcategories((prev) => prev.filter((s) => s !== sub));
  };

  const handleAddCategory = async () => {
    const trimmedName = currentCategory.trim();
    if (!trimmedName) return;

    const updatedCategories = [...selectedCategories];
    const newCategory: Category = {
      name: trimmedName,
      subcategories: selectedSubcategories,
      color: selectedColor,
    };

    const existingIndex = updatedCategories.findIndex(
      (c) => c.name === trimmedName
    );
    if (existingIndex >= 0) {
      updatedCategories[existingIndex] = newCategory;
    } else {
      updatedCategories.push(newCategory);
    }

    try {
      setIsSaving(true);
      await saveUserCategories(updatedCategories);
      setSelectedCategories(updatedCategories);
      resetForm();
      onSaveSuccess?.();
    } catch {
      alert("Erro ao salvar categoria.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setCurrentCategory("");
    setSelectedSubcategories([]);
    setSelectedColor(colorOptions[0]);
  };

  if (isLoading) return <p>Carregando categorias...</p>;

  return (
    <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-2xl shadow-lg my-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingCategory ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          {onSaveSuccess && (
            <button
              type="button"
              onClick={onSaveSuccess}
              className="text-gray-500 hover:text-black text-2xl leading-none"
            >
              ×
            </button>
          )}
        </div>

        <form className="space-y-6">
          <Input
            id="category"
            label="Nome da Categoria *"
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
            placeholder="Digite o nome da categoria"
            required
            className="text-black"
          />

          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Cor</h3>
            <div className="grid grid-cols-7 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-black scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">
              Subcategorias
            </h3>
            <div className="flex gap-2 mb-3">
              <Input
                id="subcategoria"
                label="Nome da subcategoria"
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                placeholder="Digite uma subcategoria"
                className="text-black"
              />
              <Button type="button" onClick={handleAddSubcategory}>
                Adicionar
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedSubcategories.map((sub) => (
                <div
                  key={sub}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                >
                  {sub}
                  <button
                    onClick={() => handleRemoveSubcategory(sub)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onSaveSuccess}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAddCategory}
              disabled={isSaving}
            >
              {isSaving
                ? "Salvando..."
                : editingCategory
                ? "Atualizar"
                : "Criar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
