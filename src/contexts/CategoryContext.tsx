"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getCategories,
  saveCategories,
  updateCategoryAPI,
  deleteCategoryAPI,
} from "@/services/categoryService"; // ✅ inclui PUT e DELETE
import {
  getIncomeCategories,
  saveIncomeCategories,
} from "@/services/incomeCategoryService";
import { getUserIdFromToken } from "@/utils/auth";

export interface Category {
  name: string;
  subcategories: string[];
  color: string;
}

interface CategoryContextType {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  saveUserCategories: (categories: Category[]) => Promise<void>;
  updateCategory: (updatedCategory: Category) => Promise<void>;
  removeCategory: (name: string) => Promise<void>;
  isLoading: boolean;

  incomeCategories: string[];
  setIncomeCategories: (categories: string[]) => void;
  saveUserIncomeCategories: (categories: string[]) => Promise<void>;
  isIncomeLoading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [incomeCategories, setIncomeCategories] = useState<string[]>([]);
  const [isIncomeLoading, setIsIncomeLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;

      try {
        const [loadedCategories, loadedIncomeCategories] = await Promise.all([
          getCategories(userId),
          getIncomeCategories(userId),
        ]);

        setCategories(loadedCategories || []);
        setIncomeCategories(loadedIncomeCategories || []);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      } finally {
        setIsLoading(false);
        setIsIncomeLoading(false);
      }
    };

    fetchAll();
  }, []);

  const saveUserCategories = async (updatedCategories: Category[]) => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    await saveCategories(userId, updatedCategories);
    setCategories(updatedCategories);
  };

  const updateCategory = async (updatedCategory: Category) => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    await updateCategoryAPI(userId, updatedCategory);
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === updatedCategory.name ? updatedCategory : cat
      )
    );
  };

  const removeCategory = async (categoryName: string) => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    await deleteCategoryAPI(userId, categoryName);
    setCategories((prev) => prev.filter((cat) => cat.name !== categoryName));
  };

  const saveUserIncomeCategories = async (
    updatedIncomeCategories: string[]
  ) => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    await saveIncomeCategories(userId, updatedIncomeCategories);
    setIncomeCategories(updatedIncomeCategories);
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        setCategories,
        saveUserCategories,
        updateCategory, // ✅ novo
        removeCategory, // ✅ novo
        isLoading,
        incomeCategories,
        setIncomeCategories,
        saveUserIncomeCategories,
        isIncomeLoading,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context)
    throw new Error("useCategory deve ser usado dentro de CategoryProvider");
  return context;
};
