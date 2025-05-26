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
import { MONTHS } from "@/utils/constants";
import { useDate } from "@/contexts/DateContext";
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
  const { selectedMonth, selectedYear, setMonth } = useDate();

  const [formData, setFormData] = useState({
    type: "",
    name: "",
    amount: "",
    day: "",
    isCrypto: false,
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (investmentToEdit) {
      const date = new Date(investmentToEdit.date);
      setFormData({
        type: investmentToEdit.type || "",
        name: investmentToEdit.name || "",
        amount: investmentToEdit.amount.toString(),
        day: date.getDate().toString(),
        isCrypto: investmentToEdit.isCrypto || false,
        description: investmentToEdit.description || "",
      });
      setMonth(date.getMonth());
    }
  }, [investmentToEdit, setMonth]);

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

      const payload = {
        userId,
        type: formData.type,
        name: formData.name,
        amount: parseFloat(formData.amount),
        isCrypto: formData.type === "cripto" ? true : formData.isCrypto,
        description: formData.description,
        date: new Date(
          selectedYear,
          selectedMonth,
          parseInt(formData.day)
        ).toISOString(),
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
        day: "",
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {investmentToEdit ? "Editar Investimento" : "Novo Investimento"}
          </h2>
          <p className="text-sm text-gray-600">
            Preencha os dados do investimento
          </p>
        </div>
        {onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-2xl text-gray-500 hover:text-black font-bold"
          >
            ×
          </button>
        )}
      </div>

      <Select
        id="month"
        label="Mês"
        options={MONTHS.map((label, index) => ({
          value: index.toString(),
          label,
        }))}
        required
        value={selectedMonth.toString()}
        onChange={(e) => setMonth(Number(e.target.value))}
      />

      <Input
        id="day"
        name="day"
        label="Dia do mês"
        type="number"
        placeholder="1-31"
        required
        value={formData.day}
        onChange={handleChange}
      />

      <Select
        id="type"
        label="Tipo de investimento"
        required
        value={formData.type}
        onChange={handleChange}
        options={investmentTypes}
      />

      <Input
        id="name"
        name="name"
        label="Nome do ativo"
        placeholder="Ex: Bitcoin, Tesouro Selic"
        required
        value={formData.name}
        onChange={handleChange}
      />

      <Input
        id="amount"
        name="amount"
        label="Valor investido (R$)"
        type="number"
        required
        value={formData.amount}
        onChange={handleChange}
      />

      <Input
        id="description"
        name="description"
        label="Descrição (opcional)"
        value={formData.description}
        onChange={handleChange}
      />

      <Checkbox
        id="isCrypto"
        label="É um criptoativo?"
        checked={formData.isCrypto}
        onChange={handleChange}
      />

      <div className="pt-4 flex gap-4">
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
  );
};

export default InvestmentForm;
