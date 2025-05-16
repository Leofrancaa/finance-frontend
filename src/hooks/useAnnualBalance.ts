import { useExpenses } from "@/contexts/ExpensesContext";
import { useIncomes } from "@/contexts/IncomesContext";
import { useDate } from "@/contexts/DateContext";

export const useAnnualBalance = () => {
    const { expenses } = useExpenses();
    const { incomes } = useIncomes();
    const { selectedYear } = useDate();

    const totalDespesasAnual = expenses
        .filter((e) => new Date(e.date).getFullYear() === selectedYear)
        .reduce((sum, e) => sum + e.amount, 0);

    const totalReceitasAnual = incomes
        .filter((i) => new Date(i.date).getFullYear() === selectedYear)
        .reduce((sum, i) => sum + i.amount, 0);

    const saldoAnual = totalReceitasAnual - totalDespesasAnual;

    return { saldoAnual };
};