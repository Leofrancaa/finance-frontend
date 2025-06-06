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
                console.error(err);
                alert("Erro ao carregar despesas");
            });
    }, [setExpenses]);
};
