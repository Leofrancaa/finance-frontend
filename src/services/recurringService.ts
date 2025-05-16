import { RecurringExpense } from "@/interfaces/RecurringExpense";
import { Expense } from "@/interfaces/Expense";
import { AddExpenseData } from "@/interfaces/Expense";
import { API_BASE_URL } from "@/utils/api"; // 🔥 importando a URL da API
import { fetchAuth } from "./apiService";

export function buildRecurringPayload(
    data: AddExpenseData,
    year: number,
    month: number
): RecurringExpense {
    const startDate = new Date(year, month, Number(data.day))
        .toISOString()
        .slice(0, 10);

    return {
        type: data.type,
        amount: Number(data.amount),
        note: data.note,
        paymentMethod: data.paymentMethod || "default",
        day: Number(data.day),
        startDate,
        fixed: true,
        _id: "", // será preenchido pelo backend
        subcategory: data.subcategory,
        creditCardId: data.creditCardId,
    };
}

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

// 🆕 AQUI: postRecurringExpense
export async function postRecurringExpense(
    recurring: Omit<RecurringExpense, "id">
): Promise<RecurringExpense> {
    const response = await fetchAuth(`${API_BASE_URL}/api/recurring-expenses`, {
        method: "POST",
        body: JSON.stringify(recurring),
    });

    // Normalizar a resposta
    const fixedResponse = {
        ...response,
        id: response.id || response._id, // usa id se existir, senão usa _id
    };

    return fixedResponse;
}