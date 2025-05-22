"use client";

import { useState } from "react";
import { useCreditCards } from "@/contexts/CreditCardContext";
import Input from "@/components/Input";
import Button from "@/components/Button";

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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Cadastro de Cartões de Crédito
        </h2>
        <p className="text-gray-600">
          Adicione seus cartões para controle de gastos
        </p>
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
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />

          <Input
            id="lastDigits"
            label="4 últimos dígitos"
            placeholder="Ex: 1234"
            required
            maxLength={4}
            value={lastDigits}
            onChange={(e) => setLastDigits(e.target.value)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="secondary"
            className="w-full md:w-auto"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
            }
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path
                          fillRule="evenodd"
                          d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        />
                      </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            Salvar cartões
          </Button>
        </div>
      </form>
    </div>
  );
}
