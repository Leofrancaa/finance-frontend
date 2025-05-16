import { getToken } from "@/utils/auth";

export async function fetchAuth(url: string, options: RequestInit = {}) {
    const token = getToken();
    if (!token) throw new Error("Token não encontrado. Faça login novamente.");

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = "Erro na requisição.";
        try {
            const errorData = await response.json();
            errorMessage = errorData?.error || errorMessage;
        } catch (error) {
            console.error("Erro ao interpretar resposta JSON de erro:", error);
        }
        throw new Error(errorMessage);
    }

    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao interpretar resposta JSON:", error);
        throw new Error("Erro ao interpretar resposta do servidor.");
    }
}
