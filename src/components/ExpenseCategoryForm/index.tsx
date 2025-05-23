import React, { useState, useEffect } from "react";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import { useCategory, Category } from "@/contexts/CategoryContext";
import { DEFAULT_CATEGORIES } from "@/utils/constants";

export default function CategoryManagerForm({
  onSaveSuccess,
}: {
  onSaveSuccess?: () => void;
}) {
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
    } else if (exists) {
      setSelectedCategories(
        selectedCategories.map((cat) =>
          cat.name === currentCategory
            ? { ...cat, subcategories: selectedSubcategories }
            : cat
        )
      );
    }

    setCurrentCategory("");
    setSelectedSubcategories([]);
  };

  const toggleSubcategory = (sub: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
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

  const categoryOptions = DEFAULT_CATEGORIES.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  if (isLoading) return <p>Carregando categorias...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <div className="mb-6 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Cadastro de Categorias de Despesa
        </h2>
        <p className="text-gray-600">
          Configure as categorias para suas despesas
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
        <Select
          id="category"
          label="Tipo"
          options={categoryOptions}
          required
          value={currentCategory}
          placeholder="Selecione uma opção"
          onChange={(e) => {
            setCurrentCategory(e.target.value);
            setSelectedSubcategories(
              selectedCategories.find((c) => c.name === e.target.value)
                ?.subcategories || []
            );
          }}
        />

        {currentCategory && availableSubcategories.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-md font-medium text-gray-700 mb-3">Subtipos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableSubcategories.map((sub) => (
                <Checkbox
                  key={sub}
                  id={`sub-${sub}`}
                  label={sub}
                  checked={selectedSubcategories.includes(sub)}
                  onChange={() => toggleSubcategory(sub)}
                />
              ))}
            </div>
          </div>
        )}

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
