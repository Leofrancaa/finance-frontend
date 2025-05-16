import { fetchAuth } from "./apiService"; // Usa o fetch autenticado

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Busca os limites de gastos do usuário logado na API.
 * @returns {Promise<Record<string, number>>} - Os limites de gastos.
 */
export const getThresholdsFromAPI = async (): Promise<Record<string, number>> => {
  try {
    // fetchAuth já retorna os dados JSON ou lança um erro
    const data = await fetchAuth(`${API_URL}/api/thresholds`);
    // Se fetchAuth retornar algo (não lançou erro), retornamos os dados ou um objeto vazio

    return data || {};
  } catch (error: unknown) {
    // Se o erro for "Token não encontrado", relança para o contexto lidar
    if (error instanceof Error && error.message.includes("Token não encontrado")) {
      throw error;
    }
    // Para outros erros (incluindo erros de rede ou 404/500 tratados pelo fetchAuth),
    // loga o erro e retorna um objeto vazio para não quebrar a UI.
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
export const saveThresholdsToAPI = async (thresholds: Record<string, number>): Promise<Record<string, number>> => {
  try {
    // fetchAuth já retorna os dados JSON da resposta bem-sucedida ou lança um erro
    const savedData = await fetchAuth(`${API_URL}/api/thresholds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(thresholds),
    });
    return savedData || {};
  } catch (error: unknown) {
    // Loga o erro e relança para que o contexto/componente possa tratá-lo (ex: mostrar alerta)
    if (error instanceof Error) {
      console.error("Erro na chamada API para salvar limites (saveThresholdsToAPI):", error.message);
    } else {
      console.error("Erro desconhecido na chamada API para salvar limites (saveThresholdsToAPI):", error);
    }
    throw error; // Relança o erro para ser tratado no contexto/formulário
  }
};

