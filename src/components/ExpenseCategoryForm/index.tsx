"use client";

import { useCategory, Category } from "@/contexts/CategoryContext";
import { DEFAULT_CATEGORIES } from "@/utils/constants";
import { useState, useEffect } from "react";

export default function CategoryManagerForm() {
  const { categories, saveUserCategories, isLoading } = useCategory();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );

  useEffect(() => {
    setSelectedCategories(categories);
  }, [categories]);

  const availableSubcategories =
    DEFAULT_CATEGORIES.find((cat) => cat.name === currentCategory)
      ?.subcategories || [];

  const handleAddCategory = () => {
    if (!currentCategory) return;

    const exists = selectedCategories.find(
      (cat) => cat.name === currentCategory
    );
    const fullCategory = DEFAULT_CATEGORIES.find(
      (cat) => cat.name === currentCategory
    );

    if (!exists && fullCategory) {
      setSelectedCategories([
        ...selectedCategories,
        {
          name: currentCategory,
          subcategories: selectedSubcategories,
        },
      ]);
    }

    // reset
    setCurrentCategory("");
    setSelectedSubcategories([]);
  };

  const toggleSubcategory = (sub: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleSave = async () => {
    await saveUserCategories(selectedCategories);
    alert("Categorias atualizadas com sucesso!");
  };

  if (isLoading) return <p>Carregando categorias...</p>;

  return (
    <div className="p-4 border rounded-md bg-white shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Gerenciar Categorias</h2>

      <div className="flex gap-4 items-start">
        {/* Select de Categoria */}
        <div className="flex-1">
          <label className="block mb-1 font-medium">Categoria</label>
          <select
            className="w-full p-2 border rounded-md"
            value={currentCategory}
            onChange={(e) => {
              setCurrentCategory(e.target.value);
              setSelectedSubcategories([]);
            }}
          >
            <option value="">Selecione</option>
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategorias com checkbox */}
        {currentCategory && availableSubcategories.length > 0 && (
          <div className="flex-1">
            <label className="block mb-1 font-medium">Subcategorias</label>
            <div className="flex flex-col gap-2 border rounded-md p-2 max-h-40 overflow-y-auto">
              {availableSubcategories.map((sub) => (
                <label key={sub} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedSubcategories.includes(sub)}
                    onChange={() => toggleSubcategory(sub)}
                  />
                  {sub}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Botão Adicionar */}
        <button
          onClick={handleAddCategory}
          className="mt-6 bg-blue-600 text-white h-10 px-4 rounded hover:bg-blue-700"
        >
          +
        </button>
      </div>

      {/* Lista visual das categorias adicionadas */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Categorias Selecionadas</h3>
        {selectedCategories.length === 0 ? (
          <p className="text-gray-500">Nenhuma categoria selecionada.</p>
        ) : (
          <ul className="list-disc list-inside text-sm">
            {selectedCategories.map((cat) => (
              <li key={cat.name}>
                {cat.name}
                {cat.subcategories.length > 0 && (
                  <span className="text-gray-600">
                    : {cat.subcategories.join(", ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botão de salvar */}
      <button
        onClick={handleSave}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Salvar Categorias
      </button>
    </div>
  );
}
