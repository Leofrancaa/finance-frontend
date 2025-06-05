"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getThresholdsFromAPI,
  saveThresholdsToAPI,
} from "@/services/thresholdsService";
import { useUser } from "./UserContext";

interface AlertThresholdContextProps {
  thresholds: Record<string, number>;
  isLoading: boolean;
  setThreshold: (category: string, value: number) => Promise<void>;
  saveAllThresholds: (limits: Record<string, number>) => Promise<void>;
}

const AlertThresholdContext = createContext<
  AlertThresholdContextProps | undefined
>(undefined);

export const AlertThresholdProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [thresholds, setThresholds] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  // Carrega limites do backend
  useEffect(() => {
    const fetchThresholds = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const apiThresholds = await getThresholdsFromAPI();
          setThresholds(apiThresholds || {});
        } catch (error) {
          console.error("Erro ao buscar limites da API:", error);
          setThresholds({});
        } finally {
          setIsLoading(false);
        }
      } else {
        setThresholds({});
        setIsLoading(false);
      }
    };

    fetchThresholds();
  }, [user]);

  // Define um único limite (útil para alterações diretas)
  const setThreshold = useCallback(
    async (category: string, value: number) => {
      if (!user) return;

      const updated = { ...thresholds, [category]: value };
      setThresholds(updated);

      try {
        await saveThresholdsToAPI(updated);
        console.log("Limite salvo para:", category, value);
      } catch (error) {
        console.error("Erro ao salvar limite individual:", error);
        alert("Erro ao salvar limite.");
      }
    },
    [thresholds, user]
  );

  // Salva todos os limites válidos
  const saveAllThresholds = useCallback(
    async (limits: Record<string, number>) => {
      if (!user) return;

      const filteredLimits: Record<string, number> = {};
      for (const [category, value] of Object.entries(limits)) {
        if (typeof value === "number" && !isNaN(value) && value >= 0) {
          filteredLimits[category] = value;
        }
      }

      if (Object.keys(filteredLimits).length === 0) {
        console.warn("Nenhum limite válido para salvar.");
        return;
      }

      setThresholds(filteredLimits);
      setIsLoading(true);

      try {
        await saveThresholdsToAPI(filteredLimits);
        console.log("Todos os limites salvos:", filteredLimits);
      } catch (error) {
        console.error("Erro ao salvar limites:", error);
        alert("Erro ao salvar limites.");
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return (
    <AlertThresholdContext.Provider
      value={{ thresholds, isLoading, setThreshold, saveAllThresholds }}
    >
      {children}
    </AlertThresholdContext.Provider>
  );
};

export const useAlertThreshold = () => {
  const context = useContext(AlertThresholdContext);
  if (!context) {
    throw new Error(
      "useAlertThreshold precisa estar dentro do AlertThresholdProvider"
    );
  }
  return context;
};
