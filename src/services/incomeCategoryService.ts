import { fetchAuth } from "@/services/apiService";
import { API_BASE_URL } from "@/utils/api";

// 📥 Busca as categorias de receita do usuário
export async function getIncomeCategories(userId: string): Promise<string[]> {
    const response = await fetchAuth(`${API_BASE_URL}/api/income-categories/${userId}`, {
        method: "GET",
    });
    return response;
}

// 💾 Salva as categorias de receita selecionadas pelo usuário
export async function saveIncomeCategories(userId: string, categories: string[]): Promise<void> {
    await fetchAuth(`${API_BASE_URL}/api/income-categories/${userId}`, {
        method: "POST",
        body: JSON.stringify({ categories }),
    });
}
