import { fetchAuth } from "./apiService"; // Usa o fetch autenticado

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Busca os limites de gastos do usuário logado na API.
 * @returns {Promise<Record<string, number>>} - Os limites de gastos.
 */
export const getThresholdsFromAPI = async (): Promise<Record<string, number>> => {
  try {
    const data = await fetchAuth(`${API_URL}/api/thresholds`);
    return data || {};
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("Token não encontrado")) {
      throw error;
    }
    if (error instanceof Error) {
      console.error("Erro na chamada API para buscar limites (getThresholdsFromAPI):", error.message);
    } else {
      console.error("Erro desconhecido na chamada API para buscar limites (getThresholdsFromAPI):", error);
    }
    return {};
  }
};

/**
 * Salva os limites de gastos do usuário logado na API.
 * @param {Record<string, number>} thresholds - Os limites a serem salvos.
 * @returns {Promise<Record<string, number>>} - Os limites salvos.
 */
export const saveThresholdsToAPI = async (
  thresholds: Record<string, number>
): Promise<Record<string, number>> => {
  try {
    const savedData = await fetchAuth(`${API_URL}/api/thresholds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // ✅ Envia corretamente com o wrapper thresholds
      body: JSON.stringify({ thresholds }),
    });
    return savedData || {};
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro na chamada API para salvar limites (saveThresholdsToAPI):", error.message);
    } else {
      console.error("Erro desconhecido na chamada API para salvar limites (saveThresholdsToAPI):", error);
    }
    throw error;
  }
};
