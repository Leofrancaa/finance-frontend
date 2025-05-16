import { useIncomes } from "@/contexts/IncomesContext";
import { useExpenses } from "@/contexts/ExpensesContext";
import { useDate } from "@/contexts/DateContext";

export const useMonthlyBalance = () => {
    const { incomes } = useIncomes();
    const { expenses } = useExpenses();
    const { selectedMonth, selectedYear } = useDate();

    const receitasMes = incomes
        .filter((i) => {
            const d = new Date(i.date);
            return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
        })
        .reduce((acc, i) => acc + Number(i.amount), 0);

    const despesasMes = expenses
        .filter((e) => {
            const d = new Date(e.date);
            return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
        })
        .reduce((acc, e) => acc + Number(e.amount), 0);

    const saldo = receitasMes - despesasMes;

    return { saldo, receitasMes, despesasMes };
};
