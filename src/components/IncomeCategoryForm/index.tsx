"use client";

import { useState, useEffect } from "react";
import { INCOME_TYPES } from "@/utils/constants";
import { useCategory } from "@/contexts/CategoryContext"; // ou crie um específico para receitas, se preferir

export default function IncomeCategoryManagerForm() {
  const { incomeCategories, saveUserIncomeCategories, isLoading } =
    useCategory(); // adaptar para receitas se necessário
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(incomeCategories || []);
  }, [incomeCategories]);

  const toggleCategory = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSave = async () => {
    await saveUserIncomeCategories(selected);
    alert("Categorias de receita salvas com sucesso!");
  };

  if (isLoading) return <p>Carregando categorias de receita...</p>;

  return (
    <div className="p-4 border rounded-md bg-white shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Gerenciar Categorias de Receita
      </h2>

      <div className="flex flex-col gap-2">
        {INCOME_TYPES.map((name) => (
          <label key={name} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(name)}
              onChange={() => toggleCategory(name)}
            />
            {name}
          </label>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Salvar Categorias
      </button>
    </div>
  );
}
