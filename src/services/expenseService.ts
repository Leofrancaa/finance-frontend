import { AddExpenseData, Expense, ExpenseFromAPI } from "@/interfaces/Expense";
import { API_BASE_URL } from "@/utils/api";
import { fetchAuth } from "@/services/apiService";

// 👇 Tipo auxiliar: dados de despesa antes de receber o _id do MongoDB
type ExpenseToSend = Omit<Expense, "_id">;

// 🆕 Transforma o dado de AddExpenseData para ExpenseToSend
export function transformAddExpenseData(
    data: AddExpenseData,
    selectedYear: number,
    selectedMonth: number
): ExpenseToSend {
    const date = new Date(selectedYear, selectedMonth, Number(data.day));

    return {
        ...data,
        date: date.toISOString(),
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod || "default",
        fixed: !!data.fixed,
        installments: data.installments ? Number(data.installments) : undefined,
        day: Number(data.day),
        creditCardId:
            data.paymentMethod === "cartão de crédito" && data.creditCardId
                ? data.creditCardId
                : null, // <- limpa se não for cartão
    };
}


// 🗑️ Deleta uma despesa no backend
export async function deleteExpenseFromAPI(_id: string) {
    const response = await fetchAuth(`${API_BASE_URL}/api/expenses/${_id}`, {
        method: "DELETE",
    });

    return response;
}

// ➕ Cria nova despesa
export async function postExpenseToAPI(expense: Omit<Expense, "_id">) {
    try {
        const { ...safeExpense } = expense as Omit<Expense, "_id">;

        console.log("📤 Enviando para API Expense:", safeExpense);

        const response = await fetchAuth(`${API_BASE_URL}/api/expenses`, {
            method: "POST",
            body: JSON.stringify(safeExpense),
        });

        return response;
    } catch (error) {
        console.error("❌ ERRO DO BACKEND:", error);
        throw new Error("Erro ao adicionar despesa no servidor");
    }
}



// 📥 Busca todas as despesas
export async function getExpenses(): Promise<ExpenseFromAPI[]> {
    const response = await fetchAuth(`${API_BASE_URL}/api/expenses`, {
        method: "GET",
    });

    return response;
}

// 🔄 Atualiza uma despesa existente
export async function updateExpenseInAPI(id: string, expenseData: Partial<Expense>) {
    const dataToUpdate = {
        ...expenseData,
        creditCardId:
            expenseData.paymentMethod === "cartão de crédito"
                ? expenseData.creditCardId ?? null
                : null,
    };

    try {
        console.log(`📤 Enviando atualização para API Expense ID: ${id}`, dataToUpdate);
        const response = await fetchAuth(`${API_BASE_URL}/api/expenses/${id}`, {
            method: "PUT",
            body: JSON.stringify(dataToUpdate),
        });
        return response;
    } catch (error) {
        console.error("❌ ERRO DO BACKEND (Update Expense):", error);
        throw new Error("Erro ao atualizar despesa no servidor");
    }
}
