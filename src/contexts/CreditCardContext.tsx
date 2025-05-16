"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { getUserIdFromToken } from "@/utils/auth";
import {
  getCreditCards,
  addCreditCard,
  deleteCreditCard,
} from "@/services/creditCardService";

export interface CreditCard {
  _id: string;
  userId: string;
  name: string;
  lastDigits: string;
}

interface CreditCardContextType {
  cards: CreditCard[];
  fetchCards: () => Promise<void>;
  addCard: (name: string, lastDigits: string) => Promise<void>;
  removeCard: (cardId: string) => Promise<void>;
  isLoading: boolean;
}

const CreditCardContext = createContext<CreditCardContextType | undefined>(
  undefined
);

export const CreditCardProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = getUserIdFromToken();

  // ✅ Memoiza a função para evitar recriação a cada render
  const fetchCards = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const result = await getCreditCards(userId);
      setCards(result);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const addCard = async (name: string, lastDigits: string) => {
    if (!userId) return;
    const newCard = await addCreditCard(userId, name, lastDigits);
    setCards((prev) => [...prev, newCard]);
  };

  const removeCard = async (cardId: string) => {
    await deleteCreditCard(cardId);
    setCards((prev) => prev.filter((card) => card._id !== cardId));
  };

  useEffect(() => {
    fetchCards();
  }, [fetchCards]); // ✅ dependência agora incluída corretamente

  return (
    <CreditCardContext.Provider
      value={{ cards, fetchCards, addCard, removeCard, isLoading }}
    >
      {children}
    </CreditCardContext.Provider>
  );
};

export const useCreditCards = () => {
  const context = useContext(CreditCardContext);
  if (!context) {
    throw new Error(
      "useCreditCards deve ser usado dentro de CreditCardProvider"
    );
  }
  return context;
};
