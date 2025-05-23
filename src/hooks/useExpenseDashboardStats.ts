import { useExpenses } from "@/contexts/ExpensesContext";
import { useDate } from "@/contexts/DateContext";
import { useAlertThreshold } from "@/contexts/AlertThresholdContext";
import { Expense } from "@/interfaces/Expense";

export function useExpenseDashboardStats() {
    const { expenses } = useExpenses();
    const { selectedMonth, selectedYear } = useDate();
    const { thresholds } = useAlertThreshold();

    const current = expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    const previous = expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === selectedMonth - 1 && d.getFullYear() === selectedYear;
    });

    const totalCurrent = current.reduce((sum, e) => sum + e.amount, 0);
    const totalPrevious = previous.reduce((sum, e) => sum + e.amount, 0);
    const percentChange = totalPrevious ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 : null;
    const numExpenses = current.length;

    const dailyTotals: Record<number, number> = {};
    current.forEach((e) => {
        const day = new Date(e.date).getDate();
        dailyTotals[day] = (dailyTotals[day] || 0) + e.amount;
    });
    const dailyMean =
        Object.values(dailyTotals).reduce((a, b) => a + b, 0) /
        (Object.keys(dailyTotals).length || 1);
    const forecast = dailyMean * 31;

    const maxExpense = current.reduce<Expense | null>((max, e) => {
        if (!max || e.amount > max.amount) return e;
        return max;
    }, null);

    const categoriesExceeded = Object.entries(thresholds)
        .map(([type, limit]) => {
            const total = current
                .filter((e) => e.type === type)
                .reduce((sum, e) => sum + e.amount, 0);
            return total > limit ? { type, total } : null;
        })
        .filter((entry): entry is { type: string; total: number } => entry !== null);

    return {
        totalCurrent,
        totalPrevious,
        percentChange,
        numExpenses,
        dailyMean,
        forecast,
        maxExpense:
            maxExpense || {
                _id: "",
                amount: 0,
                type: "",
                date: "",
                subcategory: "",
                note: "",
                paymentMethod: "",
                fixed: false,
            },
        categoriesExceeded,
    };
}
