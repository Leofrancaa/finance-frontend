import { Category } from "@/contexts/CategoryContext";
import { fetchAuth } from "@/services/apiService";
import { API_BASE_URL } from "@/utils/api";

// 📥 Busca as categorias do usuário
export async function getCategories(userId: string): Promise<Category[]> {
    try {
        const response = await fetchAuth(`${API_BASE_URL}/api/categories/${userId}`, {
            method: "GET",
        });
        return response;
    } catch (error) {
        console.error("❌ ERRO AO BUSCAR CATEGORIAS:", error);
        throw new Error("Erro ao carregar categorias do servidor");
    }
}

// 💾 Salva ou atualiza categorias do usuário
export async function saveCategories(userId: string, categories: Category[]): Promise<void> {
    try {
        const payload = { categories };

        console.log("📤 Salvando categorias para o usuário:", userId, payload);

        await fetchAuth(`${API_BASE_URL}/api/categories/${userId}`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error("❌ ERRO AO SALVAR CATEGORIAS:", error);
        throw new Error("Erro ao salvar categorias no servidor");
    }
}
