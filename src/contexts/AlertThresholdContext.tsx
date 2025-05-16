"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getThresholdsFromAPI, saveThresholdsToAPI } from "@/services/thresholdsService";
import { useUser } from "./UserContext"; // Importa o hook do usuário para verificar se está logado
import { EXPENSE_TYPES } from "@/utils/constants"; // Importa os tipos de despesa para garantir que todos tenham um valor

interface AlertThresholdContextProps {
  thresholds: Record<string, number>;
  isLoading: boolean; // Adiciona estado de carregamento
  // setThreshold agora será assíncrono para salvar na API
  setThreshold: (category: string, value: number) => Promise<void>; 
  // Adiciona uma função para salvar todos os limites de uma vez
  saveAllThresholds: (limits: Record<string, number>) => Promise<void>; 
}

const AlertThresholdContext = createContext<
  AlertThresholdContextProps | undefined
>(undefined);

// Limites padrão iniciais (podem ser sobrescritos pelos dados da API)
const DEFAULT_THRESHOLDS: Record<string, number> = EXPENSE_TYPES.reduce((acc, type) => {
  // Define um valor padrão baixo ou 0 para todos os tipos conhecidos
  acc[type] = 100; // Ou 0, ou buscar de uma config mais robusta
  return acc;
}, {} as Record<string, number>);

export const AlertThresholdProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [thresholds, setThresholds] = useState<Record<string, number>>(DEFAULT_THRESHOLDS);
  const [isLoading, setIsLoading] = useState(true); // Inicia como true
  const { user } = useUser(); // Obtém o usuário do contexto

  // Efeito para buscar os limites da API quando o usuário logar
  useEffect(() => {
    const fetchThresholds = async () => {
      if (user) { // Só busca se o usuário estiver logado
        setIsLoading(true);
        try {
          const apiThresholds = await getThresholdsFromAPI();
          // Mescla os limites da API com os padrões para garantir que todas as categorias existam
          const mergedThresholds = { ...DEFAULT_THRESHOLDS, ...apiThresholds }; 
          setThresholds(mergedThresholds);
        } catch (error) {
          console.error("Erro ao buscar limites da API:", error);
          // Mantém os padrões em caso de erro
          setThresholds(DEFAULT_THRESHOLDS);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Se o usuário deslogar, reseta para os padrões e para de carregar
        setThresholds(DEFAULT_THRESHOLDS);
        setIsLoading(false);
      }
    };

    fetchThresholds();
  }, [user]); // Depende do usuário

  // Função para definir um limite individual (agora salva na API)
  // Esta função pode não ser ideal se o usuário alterar vários campos rapidamente
  // É melhor usar saveAllThresholds no formulário
  const setThreshold = useCallback(async (category: string, value: number) => {
    if (!user) return; // Não faz nada se não estiver logado

    const updated = { ...thresholds, [category]: value };
    setThresholds(updated); // Atualiza o estado local imediatamente para feedback

    try {
      await saveThresholdsToAPI(updated); // Salva o objeto completo na API
      console.log("Limite individual salvo na API para", category);
    } catch (error) {
      console.error("Erro ao salvar limite individual na API:", error);
      // Poderia reverter o estado local aqui ou mostrar um erro
      alert("Erro ao salvar limite na API.");
    }
  }, [thresholds, user]);

  // Função para salvar todos os limites de uma vez (preferível para o formulário)
  const saveAllThresholds = useCallback(async (limits: Record<string, number>) => {
    if (!user) return; // Não faz nada se não estiver logado
    
    // Garante que todos os tipos de despesa padrão tenham um valor numérico
    const completeLimits = { ...DEFAULT_THRESHOLDS };
    for (const type of EXPENSE_TYPES) {
      const value = limits[type];
      // Se o valor for um número válido (incluindo 0), usa ele, senão mantém o padrão
      if (typeof value === 'number' && !isNaN(value) && value >= 0) {
        completeLimits[type] = value;
      } else {
        // Se o valor for inválido (undefined, NaN, negativo), usa o padrão ou 0
        completeLimits[type] = DEFAULT_THRESHOLDS[type] ?? 0;
        console.warn(`Valor inválido ou ausente para ${type}, usando padrão/0.`);
      }
    }

    setThresholds(completeLimits); // Atualiza o estado local imediatamente
    setIsLoading(true); // Mostra carregando enquanto salva
    try {
      await saveThresholdsToAPI(completeLimits); // Salva o objeto completo na API
      console.log("Todos os limites salvos na API.");
    } catch (error) {
      console.error("Erro ao salvar todos os limites na API:", error);
      alert("Erro ao salvar limites na API.");
      // Poderia reverter o estado local aqui
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Depende apenas do usuário para a chamada API

  return (
    <AlertThresholdContext.Provider value={{ thresholds, isLoading, setThreshold, saveAllThresholds }}>
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

