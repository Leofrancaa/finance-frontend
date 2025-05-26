// src/contexts/InvestmentContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Investment } from "@/interfaces/Investment";
import { getUserIdFromToken } from "@/utils/auth";
import { getInvestmentsByUser } from "@/services/investmentService";

interface InvestmentContextType {
  investments: Investment[];
  setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>;
  addInvestment: (investment: Investment) => Promise<void>;
  removeInvestment: (id: string) => void;
  updateLocalInvestment: (updated: Investment) => void;
  fetchInvestments: () => Promise<void>;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(
  undefined
);

export const useInvestments = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error("useInvestments must be used within an InvestmentProvider");
  }
  return context;
};

export const InvestmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [investments, setInvestments] = useState<Investment[]>([]);

  const fetchInvestments = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setInvestments([]);
      return;
    }
    const data = await getInvestmentsByUser(userId);
    setInvestments(data);
  };

  const addInvestment = async (investment: Investment) => {
    setInvestments((prev) => [...prev, investment]);
  };

  const removeInvestment = (id: string) => {
    setInvestments((prev) => prev.filter((inv) => inv._id !== id));
  };

  const updateLocalInvestment = (updated: Investment) => {
    setInvestments((prev) =>
      prev.map((inv) => (inv._id === updated._id ? updated : inv))
    );
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return (
    <InvestmentContext.Provider
      value={{
        investments,
        setInvestments,
        addInvestment,
        removeInvestment,
        updateLocalInvestment,
        fetchInvestments,
      }}
    >
      {children}
    </InvestmentContext.Provider>
  );
};
