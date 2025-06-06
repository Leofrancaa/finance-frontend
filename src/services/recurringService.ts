import { RecurringExpense } from "@/interfaces/RecurringExpense";
import { Expense } from "@/interfaces/Expense";
import { AddExpenseData } from "@/interfaces/Expense";
import { API_BASE_URL } from "@/utils/api";
import { fetchAuth } from "./apiService";

// 🧠 Cria payload para despesa recorrente
export function buildRecurringPayload(
    data: AddExpenseData,
    year: number,
    month: number
): RecurringExpense {
    const day = new Date(data.date).getDate();
    const startDate = new Date(year, month, day).toISOString().slice(0, 10);

    return {
        type: data.type,
        amount: Number(data.amount),
        note: data.note,
        paymentMethod: data.paymentMethod || "default",
        day,
        startDate,
        fixed: true,
        _id: "", // será preenchido pelo backend
        subcategory: data.subcategory,
        creditCardId: data.creditCardId || null,
    };
}

// 🔁 Converte uma despesa recorrente em despesa normal com data
export function recurringToExpense(
    recurring: RecurringExpense,
    year: number,
    month: number
): Expense {
    return {
        ...recurring,
        date: new Date(year, month, recurring.day).toISOString(),
        fixed: true,
    };
}

// 📤 Salva despesa recorrente na API
export async function postRecurringExpense(
    recurring: Omit<RecurringExpense, "id">
): Promise<RecurringExpense> {
    const response = await fetchAuth(`${API_BASE_URL}/api/recurring-expenses`, {
        method: "POST",
        body: JSON.stringify(recurring),
    });

    return {
        ...response,
        id: response.id || response._id,
    };
}
