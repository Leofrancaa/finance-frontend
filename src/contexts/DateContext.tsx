"use client";
import { createContext, useContext, useState } from "react";

interface DateContextProps {
  selectedYear: number;
  selectedMonth: number;
  setYear: (y: number) => void;
  setMonth: (m: number) => void;
}

const DateContext = createContext<DateContextProps | undefined>(undefined);

export const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const now = new Date();
  const [selectedYear, setYear] = useState(now.getFullYear());
  const [selectedMonth, setMonth] = useState(now.getMonth());

  return (
    <DateContext.Provider
      value={{ selectedYear, selectedMonth, setYear, setMonth }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) throw new Error("useDate precisa estar dentro do DateProvider");
  return context;
};
