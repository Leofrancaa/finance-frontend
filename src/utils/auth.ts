import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    id: string;
    name: string;
    email: string;
}

export function getUserIdFromToken(): string | undefined {
    const token = localStorage.getItem("authToken");
    if (!token) return undefined;

    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded?.id;
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        return undefined;
    }
}


export function getToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("authToken");
    }
    return null;
}
