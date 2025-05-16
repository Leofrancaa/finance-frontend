import { Income } from "@/interfaces/Income";
<<<<<<< HEAD
import { generateUniqueId } from "@/utils/generateUniqueId";
=======
>>>>>>> staging
import { API_BASE_URL } from "@/utils/api";
import { fetchAuth } from "@/services/apiService"; // 👈 importar fetchAuth

// Cria o objeto Income (caso precise gerar ID)
export function createIncomeObject(
    data: Omit<Income, "id"> & { id?: string }
): Income {
    return {
        ...data,
    };
}

// POST: adiciona uma nova receita no backend
export async function postIncomeToAPI(
    income: Omit<Income, "_id">
) {
    const response = await fetchAuth(`${API_BASE_URL}/api/incomes`, {
        method: "POST",
        body: JSON.stringify(income),
    });

    return response;
}


// GET: busca todas as receitas
export async function getIncomes(): Promise<Income[]> {
    const response = await fetchAuth(`${API_BASE_URL}/api/incomes`, {
        method: "GET",
    });

    return response;
}

// DELETE: remove uma receita
export async function deleteIncomeFromAPI(id: string) {
    const response = await fetchAuth(`${API_BASE_URL}/api/incomes/${id}`, {
        method: "DELETE",
    });

    return response;
}



// 🔄 Atualiza uma receita no backend
export async function updateIncomeInAPI(id: string, incomeData: Partial<Income>) {
    // Remove campos que não devem ser enviados ou que são imutáveis pelo cliente diretamente
<<<<<<< HEAD
    const { _id, ...dataToUpdate } = incomeData;
=======
    const { ...dataToUpdate } = incomeData;
>>>>>>> staging

    // Garante que o amount seja número, se presente
    if (dataToUpdate.amount !== undefined) {
        dataToUpdate.amount = Number(dataToUpdate.amount);
    }

    try {
        console.log(`📤 Enviando atualização para API Income ID: ${id}`, dataToUpdate);
        const response = await fetchAuth(`${API_BASE_URL}/api/incomes/${id}`, {
            method: "PUT",
            body: JSON.stringify(dataToUpdate),
        });
        console.log("📥 Resposta da API (Update Income):", response);
        return response; // Retorna a receita atualizada
    } catch (error) {
        console.error("❌ ERRO DO BACKEND (Update Income):", error);
        throw new Error("Erro ao atualizar receita no servidor");
    }
}
