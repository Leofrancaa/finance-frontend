import { Investment } from "@/interfaces/Investment";
import { API_BASE_URL } from "@/utils/api";
import { fetchAuth } from "@/services/apiService";

// Cria objeto completo (caso queira um helper como createIncomeObject)
export function createInvestmentObject(
    data: Omit<Investment, "_id"> & { _id?: string }
): Investment {
    return {
        ...data,
    };
}

// POST: adiciona um novo investimento
export async function postInvestmentToAPI(
    investment: Omit<Investment, "_id">
): Promise<Investment> {
    const response = await fetchAuth(`${API_BASE_URL}/api/investments`, {
        method: "POST",
        body: JSON.stringify(investment),
    });

    return response;
}

// GET: busca investimentos por usuário
export async function getInvestmentsByUser(userId: string): Promise<Investment[]> {
    const response = await fetchAuth(`${API_BASE_URL}/api/investments/${userId}`, {
        method: "GET",
    });

    return response;
}

// DELETE: remove um investimento
export async function deleteInvestment(id: string): Promise<{ message: string }> {
    const response = await fetchAuth(`${API_BASE_URL}/api/investments/${id}`, {
        method: "DELETE",
    });

    return response;
}

// PUT: atualiza um investimento
export async function updateInvestment(id: string, data: Partial<Investment>): Promise<Investment> {
    const { ...dataToUpdate } = data;

    if (dataToUpdate.amount !== undefined) {
        dataToUpdate.amount = Number(dataToUpdate.amount);
    }

    try {
        console.log(`📤 Atualizando investimento ID: ${id}`, dataToUpdate);

        const response = await fetchAuth(`${API_BASE_URL}/api/investments/${id}`, {
            method: "PUT",
            body: JSON.stringify(dataToUpdate),
        });

        console.log("📥 Resposta da API (Update Investment):", response);
        return response;
    } catch (error) {
        console.error("❌ Erro ao atualizar investimento:", error);
        throw new Error("Erro ao atualizar investimento no servidor.");
    }
}
