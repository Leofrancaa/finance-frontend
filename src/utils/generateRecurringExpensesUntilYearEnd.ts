import { RecurringExpense } from "@/interfaces/RecurringExpense";
import { Expense } from "@/interfaces/Expense";

export function generateRecurringExpensesUntilYearEnd(
    recurring: RecurringExpense,
    startMonth: number,
    year: number
): Expense[] {
    const expenses: Expense[] = [];

    for (let m = startMonth; m < 12; m++) {
        expenses.push({
            _id: `recurring-${recurring._id}-${year}-${m + 1}`,
            type: recurring.type,
            amount: recurring.amount,
            date: new Date(year, m, recurring.day).toISOString(),
            note: recurring.note,
            paymentMethod: recurring.paymentMethod,
            fixed: true,
            day: recurring.day,
        });
    }

    return expenses;
}
