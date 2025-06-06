"use client";

import { useEffect } from "react";
import { useIncomes } from "@/contexts/IncomesContext";
import { getIncomes } from "@/services/incomeService";
import { Income } from "@/interfaces/Income";

export const useFetchIncomes = () => {
    const { setIncomes } = useIncomes();

    useEffect(() => {
        getIncomes()
            .then((data: Income[]) => {
                if (!data || data.length === 0) {
                    setIncomes([]); // Nenhuma receita, mas sem erro
                    return;
                }

                setIncomes(data);
            })
            .catch((err) => {
                console.error("Erro ao carregar receitas:", err);

                if (!(err instanceof Response && err.status === 404)) {
                    alert("Erro ao carregar receitas");
                }
            });
    }, [setIncomes]);
};
