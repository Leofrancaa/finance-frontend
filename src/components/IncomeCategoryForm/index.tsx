"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useCategory } from "@/contexts/CategoryContext";

export default function IncomeCategoryManagerForm({
  onSaveSuccess,
}: {
  onSaveSuccess?: () => void;
}) {
  const { incomeCategories, saveUserIncomeCategories, isLoading } =
    useCategory();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");

  useEffect(() => {
    setSelectedCategories(incomeCategories || []);
  }, [incomeCategories]);

  const handleAddCategory = () => {
    const trimmed = currentCategory.trim();
    if (!trimmed || selectedCategories.includes(trimmed)) return;
    setSelectedCategories([...selectedCategories, trimmed]);
    setCurrentCategory("");
  };

  const handleDeleteCategory = (name: string) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== name));
  };

  const handleSave = async () => {
    await saveUserIncomeCategories(selectedCategories);
    alert("Categorias de receita atualizadas com sucesso!");
    onSaveSuccess?.();
  };

  if (isLoading) return <p>Carregando categorias...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <div className="mb-6 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Cadastro de Categorias de Receita
        </h2>
        <p className="text-gray-600">Digite suas categorias personalizadas</p>
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
          id="income-category"
          label="Nova categoria de receita"
          value={currentCategory}
          onChange={(e) => setCurrentCategory(e.target.value)}
          placeholder="Ex: Freelance, Venda de produtos, etc."
          required
        />

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
              Nenhuma categoria adicionada.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedCategories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                >
                  <span className="font-medium text-gray-800">{cat}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
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
