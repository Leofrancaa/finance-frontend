"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Income } from "@/interfaces/Income";
import { deleteIncomeFromAPI } from "@/services/incomeService";

interface IncomesContextProps {
  incomes: Income[];
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
  addIncome: (income: Income) => void;
  updateIncome: (updatedIncome: Income) => void;
  deleteIncome: (id: string) => Promise<void>;
}

const IncomesContext = createContext<IncomesContextProps | undefined>(
  undefined
);

export const IncomesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [incomes, setIncomes] = useState<Income[]>([]);

  const addIncome = useCallback((income: Income) => {
    setIncomes((prev) => {
      if (prev.some((inc) => inc._id === income._id)) {
        return prev;
      }
      return [...prev, income];
    });
  }, []);

  const updateIncome = useCallback((updatedIncome: Income) => {
    setIncomes((prev) =>
      prev.map((income) =>
        income._id === updatedIncome._id ? updatedIncome : income
      )
    );
  }, []);

  const deleteIncome = async (id: string) => {
    try {
      await deleteIncomeFromAPI(id);
      setIncomes((prev) => prev.filter((income) => income._id !== id));
    } catch (err) {
      console.error("Erro ao deletar receita:", err);
      alert("Erro ao deletar receita do servidor.");
    }
  };

  return (
    <IncomesContext.Provider
      value={{ incomes, setIncomes, addIncome, updateIncome, deleteIncome }}
    >
      {children}
    </IncomesContext.Provider>
  );
};

export const useIncomes = () => {
  const context = useContext(IncomesContext);
  if (!context)
    throw new Error("useIncomes precisa estar dentro do IncomesProvider");
  return context;
};
