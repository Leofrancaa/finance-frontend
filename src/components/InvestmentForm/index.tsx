"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import {
  postInvestmentToAPI,
  updateInvestment,
} from "@/services/investmentService";
import { getUserIdFromToken } from "@/utils/auth";
import { Investment } from "@/interfaces/Investment";

interface InvestmentFormProps {
  investmentToEdit?: Investment | null;
  onCancelEdit?: () => void;
  onInvestmentUpdated?: () => void;
}

const investmentTypes = [
  { value: "cripto", label: "Criptomoeda" },
  { value: "renda-fixa", label: "Renda Fixa" },
  { value: "fundo-imobiliario", label: "Fundo Imobiliário" },
  { value: "acao", label: "Ação" },
  { value: "etf", label: "ETF" },
  { value: "previdencia", label: "Previdência Privada" },
  { value: "outros", label: "Outros" },
];

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  investmentToEdit = null,
  onCancelEdit,
  onInvestmentUpdated,
}) => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    amount: "",
    date: "",
    isCrypto: false,
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (investmentToEdit) {
      const isoDate = new Date(investmentToEdit.date)
        .toISOString()
        .split("T")[0];
      setFormData({
        type: investmentToEdit.type || "",
        name: investmentToEdit.name || "",
        amount: investmentToEdit.amount.toString(),
        date: isoDate,
        isCrypto: investmentToEdit.isCrypto || false,
        description: investmentToEdit.description || "",
      });
    }
  }, [investmentToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("ID do usuário não encontrado.");

      const parsedDate = new Date(`${formData.date}T00:00:00`);

      const payload = {
        userId,
        type: formData.type,
        name: formData.name,
        amount: parseFloat(formData.amount),
        isCrypto: formData.type === "cripto" ? true : formData.isCrypto,
        description: formData.description,
        date: formData.date,
        day: parsedDate.getDate(),
      };

      if (investmentToEdit && investmentToEdit._id) {
        await updateInvestment(investmentToEdit._id, payload);
        alert("Investimento atualizado com sucesso!");
      } else {
        await postInvestmentToAPI(payload);
        alert("Investimento adicionado com sucesso!");
      }

      setFormData({
        type: "",
        name: "",
        amount: "",
        date: "",
        isCrypto: false,
        description: "",
      });

      onInvestmentUpdated?.();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar investimento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-transparent bg-opacity-30 flex justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-3xl shadow-lg my-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {investmentToEdit ? "Editar Investimento" : "Novo Investimento"}
          </h2>
          {onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-gray-500 hover:text-black text-2xl leading-none"
            >
              ×
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="date"
              name="date"
              label="Data *"
              type="date"
              required
              value={formData.date}
              onChange={handleChange}
            />
            <Input
              id="amount"
              name="amount"
              label="Valor investido (R$) *"
              type="number"
              required
              value={formData.amount}
              onChange={handleChange}
            />
            <Select
              id="type"
              label="Tipo de investimento *"
              required
              value={formData.type}
              onChange={handleChange}
              options={investmentTypes}
            />
            <Input
              id="name"
              name="name"
              label="Nome do ativo *"
              placeholder="Ex: Bitcoin, Tesouro Selic"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mt-2">
            <Input
              id="description"
              name="description"
              label="Descrição (opcional)"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <Checkbox
            id="isCrypto"
            label="É um criptoativo?"
            checked={formData.isCrypto}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : investmentToEdit
                ? "Atualizar investimento"
                : "Salvar investimento"}
            </Button>

            {investmentToEdit && (
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={onCancelEdit}
              >
                Cancelar edição
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentForm;
