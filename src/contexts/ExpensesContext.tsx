"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Expense } from "@/interfaces/Expense";
import { deleteExpenseFromAPI } from "@/services/expenseService";

interface ExpensesContextProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  addExpense: (data: Expense) => void;
  updateExpense: (updatedExpense: Expense) => void;
  deleteExpense: (id: string) => Promise<void>;
}

const ExpensesContext = createContext<ExpensesContextProps | undefined>(
  undefined
);

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Type guard for legacy id property
  function hasLegacyId(obj: unknown): obj is { id: string } {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "id" in obj &&
      typeof (obj as { id: unknown }).id === "string"
    );
  }

  const addExpense = useCallback((data: Expense) => {
    const idToCheck = data._id ?? (hasLegacyId(data) ? data.id : undefined); // retrocompatibilidade
    setExpenses((prev) => {
      if (
        prev.some((exp) => {
          const expId = exp._id ?? (hasLegacyId(exp) ? exp.id : undefined);
          return expId === idToCheck;
        })
      ) {
        return prev;
      }
      return [...prev, data];
    });
  }, []);

  const updateExpense = useCallback((updatedExpense: Expense) => {
    const idToMatch =
      updatedExpense._id ??
      (hasLegacyId(updatedExpense) ? updatedExpense.id : undefined);
    setExpenses((prev) =>
      prev.map((expense) =>
        (expense._id ?? (hasLegacyId(expense) ? expense.id : undefined)) ===
        idToMatch
          ? updatedExpense
          : expense
      )
    );
  }, []);

  const deleteExpense = async (id: string) => {
    try {
      const expenseToDelete = expenses.find((exp) => exp._id === id);

      if (!expenseToDelete) {
        console.warn(
          `Tentativa de deletar despesa com ID ${id} não encontrada no contexto.`
        );
        return;
      }

      await deleteExpenseFromAPI(expenseToDelete._id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Erro ao deletar despesa:", err);
      alert("Erro ao deletar despesa do servidor.");
    }
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        setExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context)
    throw new Error("useExpenses precisa estar dentro do ExpensesProvider");
  return context;
};
