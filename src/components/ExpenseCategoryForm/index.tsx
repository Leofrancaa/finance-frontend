"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useCategory, Category } from "@/contexts/CategoryContext";

export default function CategoryManagerForm({
  onSaveSuccess,
}: {
  onSaveSuccess?: () => void;
}) {
  const { categories, saveUserCategories, isLoading } = useCategory();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [newSub, setNewSub] = useState<string>("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );

  useEffect(() => {
    setSelectedCategories(categories);
  }, [categories]);

  const handleAddSubcategory = () => {
    if (!newSub.trim()) return;
    if (!selectedSubcategories.includes(newSub.trim())) {
      setSelectedSubcategories([...selectedSubcategories, newSub.trim()]);
      setNewSub("");
    }
  };

  const handleRemoveSubcategory = (sub: string) => {
    setSelectedSubcategories((prev) => prev.filter((s) => s !== sub));
  };

  const handleAddCategory = () => {
    if (!currentCategory.trim()) return;

    const exists = selectedCategories.find(
      (cat) => cat.name === currentCategory.trim()
    );

    if (!exists) {
      setSelectedCategories([
        ...selectedCategories,
        {
          name: currentCategory.trim(),
          subcategories: selectedSubcategories,
        },
      ]);
    } else {
      setSelectedCategories(
        selectedCategories.map((cat) =>
          cat.name === currentCategory.trim()
            ? { ...cat, subcategories: selectedSubcategories }
            : cat
        )
      );
    }

    setCurrentCategory("");
    setSelectedSubcategories([]);
  };

  const handleDeleteCategory = (name: string) => {
    setSelectedCategories(
      selectedCategories.filter((cat) => cat.name !== name)
    );
  };

  const handleSave = async () => {
    await saveUserCategories(selectedCategories);
    alert("Categorias atualizadas com sucesso!");
    onSaveSuccess?.();
  };

  if (isLoading) return <p>Carregando categorias...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <div className="mb-6 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Cadastro de Categorias de Despesa
        </h2>
        <p className="text-gray-600">
          Digite o nome da categoria e suas subcategorias manualmente
        </p>
        {onSaveSuccess && (
          <button
            type="button"
            onClick={onSaveSuccess}
            className="absolute top-0 right-0 text-3xl text-gray-500 hover:text-black cursor-pointer"
          >
            &times;
          </button>
        )}
      </div>

      <form className="space-y-6">
        <Input
          id="category"
          label="Categoria"
          value={currentCategory}
          onChange={(e) => setCurrentCategory(e.target.value)}
          placeholder="Digite o nome da categoria"
          required
        />

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Subcategorias
          </h3>
          <div className="flex gap-2 mb-3">
            <Input
              id="subcategoria"
              label="Nova subcategoria"
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
              placeholder="Digite uma subcategoria"
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

        <div className="flex justify-end">
          <Button variant="secondary" onClick={handleAddCategory} type="button">
            Adicionar categoria
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Categorias selecionadas
          </h3>
          {selectedCategories.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Nenhuma categoria selecionada.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedCategories.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                >
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">
                      {cat.name}
                    </span>
                    {cat.subcategories.length > 0 && (
                      <>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {cat.subcategories.join(", ")}
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-.894.553L4.382 4H3a1 1 0 000 2h1v10a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-1.382l-.724-1.447A1 1 0 0014 2H6zm2 5a1 1 0 012 0v6a1 1 0 11-2 0V7zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V7a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="button" variant="primary" fullWidth onClick={handleSave}>
          Salvar categorias
        </Button>
      </form>
    </div>
  );
}
