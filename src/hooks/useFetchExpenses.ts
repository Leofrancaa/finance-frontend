"use client";

import { useEffect } from "react";
import { useExpenses } from "@/contexts/ExpensesContext";
import { Expense, ExpenseFromAPI } from "@/interfaces/Expense";
import { getExpenses } from "@/services/expenseService";

export const useFetchExpenses = () => {
    const { setExpenses } = useExpenses();

    useEffect(() => {
        getExpenses()
            .then((data: ExpenseFromAPI[]) => {
                if (!data || data.length === 0) {
                    setExpenses([]); // Nenhuma despesa, mas sem erro
                    return;
                }

                const mapped: Expense[] = data.map((e) => ({
                    _id: e._id || "",
                    type: e.type,
                    amount: Number(e.amount),
                    day: Number(e.day),
                    paymentMethod: e.paymentMethod,
                    installments: e.installments ? Number(e.installments) : undefined,
                    note: e.note,
                    fixed: e.fixed,
                    date: e.date,
                    subcategory: e.subcategory,
                }));

                setExpenses(mapped);
            })
            .catch((err) => {
                console.error("Erro ao carregar despesas:", err);

                // Só mostra alerta se for erro de rede ou servidor (não erro "esperado" como 404 sem conteúdo)
                if (!(err instanceof Response && err.status === 404)) {
                    alert("Erro ao carregar despesas");
                }
            });
    }, [setExpenses]);
};
