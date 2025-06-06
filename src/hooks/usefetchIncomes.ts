"use client";

import { useEffect } from "react";
import { useIncomes } from "@/contexts/IncomesContext";
import { getIncomes } from "@/services/incomeService"; // 👈 agora importa do lugar certo
import { Income } from "@/interfaces/Income";

export const useFetchIncomes = () => {
    const { setIncomes } = useIncomes();

    useEffect(() => {
        getIncomes()
            .then((data: Income[]) => {
                setIncomes(data);
            })
            .catch((err) => {
                console.error(err);
                alert("Erro ao carregar receitas");
            });
    }, [setIncomes]);
};