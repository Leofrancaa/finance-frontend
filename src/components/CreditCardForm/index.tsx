"use client";

import { useState } from "react";
import { useCreditCards } from "@/contexts/CreditCardContext";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function CreditCardForm({ onClose }: { onClose?: () => void }) {
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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Cadastro de Cartões de Crédito
          </h2>
          <p className="text-gray-600">
            Adicione seus cartões para controle de gastos
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            title="Fechar"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="cardName"
            label="Nome do cartão"
            placeholder="Ex: Nubank, Itaú, Santander"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            id="lastDigits"
            label="4 últimos dígitos"
            placeholder="Ex: 1234"
            required
            maxLength={4}
            value={lastDigits}
            onChange={(e) => setLastDigits(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="secondary"
            className="w-full md:w-auto"
          >
            Adicionar cartão
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-md mt-4 border border-gray-200">
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Cartões adicionados
          </h3>
          <div className="space-y-2">
            {isLoading ? (
              <p className="text-gray-500">Carregando cartões...</p>
            ) : cards.length === 0 ? (
              <p className="text-gray-500">Nenhum cartão cadastrado.</p>
            ) : (
              cards.map((card, index) => (
                <div
                  key={card._id}
                  className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-full mr-3 ${
                        index % 3 === 0
                          ? "bg-purple-100 text-purple-600"
                          : index % 3 === 1
                          ? "bg-blue-100 text-blue-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      💳
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{card.name}</h4>
                      <p className="text-sm text-gray-500">
                        Final {card.lastDigits}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(card._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-6">
          <Button type="button" variant="primary" fullWidth onClick={onClose}>
            Salvar cartões
          </Button>
        </div>
      </form>
    </div>
  );
}
