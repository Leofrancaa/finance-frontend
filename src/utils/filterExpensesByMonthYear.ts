import { Expense } from "@/interfaces/Expense";

export function filterExpensesByMonthYear(
    expenses: Expense[],
    year: number,
    month: number
): Expense[] {
    return expenses.filter((expense) => {
        const date = new Date(expense.date);
        return date.getFullYear() === year && date.getMonth() === month;
    });
}
