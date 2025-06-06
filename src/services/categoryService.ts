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

// 💾 Salva ou atualiza a lista completa de categorias
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

// 🛠 Atualiza uma única categoria pelo nome
export async function updateCategoryAPI(
    userId: string,
    categoryName: string,
    updatedCategory: Category
): Promise<void> {
    try {
        await fetchAuth(
            `${API_BASE_URL}/api/categories/${userId}/${encodeURIComponent(categoryName)}`,
            {
                method: "PUT",
                body: JSON.stringify(updatedCategory),
            }
        );
    } catch (error) {
        console.error("❌ ERRO AO ATUALIZAR CATEGORIA:", error);
        throw new Error("Erro ao atualizar categoria no servidor");
    }
}

// ❌ Remove uma categoria pelo nome
export async function deleteCategoryAPI(
    userId: string,
    categoryName: string
): Promise<void> {
    try {
        await fetchAuth(
            `${API_BASE_URL}/api/categories/${userId}/${encodeURIComponent(categoryName)}`,
            {
                method: "DELETE",
            }
        );
    } catch (error) {
        console.error("❌ ERRO AO DELETAR CATEGORIA:", error);
        throw new Error("Erro ao deletar categoria no servidor");
    }
}
