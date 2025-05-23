import { useIncomes } from "@/contexts/IncomesContext";
import { useDate } from "@/contexts/DateContext";

const META_MENSAL = 6000; // ou carregue de alguma config do usuário

export function useIncomeDashboardStats() {
    const { incomes } = useIncomes();
    const { selectedMonth, selectedYear } = useDate();

    const current = incomes.filter((i) => {
        const d = new Date(i.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    const previous = incomes.filter((i) => {
        const d = new Date(i.date);
        return d.getMonth() === selectedMonth - 1 && d.getFullYear() === selectedYear;
    });

    const totalCurrent = current.reduce((sum, i) => sum + i.amount, 0);
    const totalPrevious = previous.reduce((sum, i) => sum + i.amount, 0);
    const percentChange = totalPrevious ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 : null;
    const numIncomes = current.length;

    const dailyMap = new Map<number, number>();
    current.forEach((i) => {
        const day = new Date(i.date).getDate();
        dailyMap.set(day, (dailyMap.get(day) || 0) + i.amount);
    });

    const dailyMean = [...dailyMap.values()].reduce((a, b) => a + b, 0) / dailyMap.size || 0;
    const daysWithIncome = dailyMap.size;

    const maxIncome = current.reduce((max, i) => (i.amount > max.amount ? i : max), { amount: 0 });

    const metaAtingida = totalCurrent >= META_MENSAL;
    const restanteMeta = Math.max(0, META_MENSAL - totalCurrent);

    return {
        totalCurrent,
        percentChange,
        numIncomes,
        dailyMean,
        daysWithIncome,
        maxIncome,
        metaAtingida,
        restanteMeta,
        meta: META_MENSAL,
    };
}
