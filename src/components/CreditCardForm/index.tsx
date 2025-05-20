"use client";

import { useState } from "react";
import { useCreditCards } from "@/contexts/CreditCardContext";

export default function CreditCardForm() {
  const { cards, addCard, removeCard, isLoading } = useCreditCards();
  const [name, setName] = useState("");
  const [lastDigits, setLastDigits] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !lastDigits.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    if (lastDigits.length !== 4 || isNaN(Number(lastDigits))) {
      alert("Informe os 4 últimos dígitos numéricos do cartão.");
      return;
    }

    try {
      await addCard(name, lastDigits);
      setName("");
      setLastDigits("");
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
      alert("Erro ao adicionar cartão");
    }
  };

  const handleDelete = async (cardId: string) => {
    try {
      await removeCard(cardId);
    } catch (error) {
      console.error("Erro ao remover cartão:", error);
      alert("Erro ao remover cartão");
    }
  };

  return (
    <div className="p-4 bg-white rounded-md border w-full shadow-md">
      <h2 className="text-xl font-bold mb-4">Cartões de Crédito</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          placeholder="Nome do cartão (ex: Nubank)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Últimos dígitos"
          maxLength={4}
          value={lastDigits}
          onChange={(e) => setLastDigits(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Adicionar Cartão
        </button>
      </form>

      {isLoading ? (
        <p>Carregando cartões...</p>
      ) : cards.length === 0 ? (
        <p className="text-gray-500">Nenhum cartão cadastrado.</p>
      ) : (
        <ul className="space-y-2">
          {cards.map((card) => (
            <li
              key={card._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>
                {card.name} •••• {card.lastDigits}
              </span>
              <button
                onClick={() => handleDelete(card._id)}
                className="text-red-600 text-sm hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
