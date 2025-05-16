// src/services/creditCardService.ts
import { fetchAuth } from "./apiService";
import { API_BASE_URL } from "@/utils/api";

export async function getCreditCards(userId: string) {
    return await fetchAuth(`${API_BASE_URL}/api/credit-cards/${userId}`);
}

export async function addCreditCard(userId: string, name: string, lastDigits: string) {
    return await fetchAuth(`${API_BASE_URL}/api/credit-cards/${userId}`, {
        method: "POST",
        body: JSON.stringify({ name, lastDigits }),
    });
}

export async function deleteCreditCard(cardId: string) {
    return await fetchAuth(`${API_BASE_URL}/api/credit-cards/${cardId}`, {
        method: "DELETE",
    });
}
