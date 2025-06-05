"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Input from "@/components/Input";
import { useAlertThreshold } from "@/contexts/AlertThresholdContext";
import { useCategory } from "@/contexts/CategoryContext";
import { useExpenses } from "@/contexts/ExpensesContext";

export default function AlertThresholdForm({
  onSaveSuccess,
}: {
  onSaveSuccess?: () => void;
}) {
  const { thresholds, saveAllThresholds } = useAlertThreshold();
  const { expenses } = useExpenses();
  const { categories } = useCategory(); // ✅ pega as categorias cadastradas

  const [localThresholds, setLocalThresholds] = useState<
    Record<string, number>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [limitValue, setLimitValue] = useState("");

  useEffect(() => {
    setLocalThresholds(thresholds);
  }, [thresholds]);

  const handleAddThreshold = () => {
    const trimmed = selectedCategory.trim();
    const parsed = parseFloat(limitValue);

    if (!trimmed || isNaN(parsed) || parsed < 0 || localThresholds[trimmed])
      return;

    setLocalThresholds((prev) => ({
      ...prev,
      [trimmed]: parsed,
    }));

    setSelectedCategory("");
    setLimitValue("");
  };

  const handleDeleteThreshold = (category: string) => {
    const updated = { ...localThresholds };
    delete updated[category];
    setLocalThresholds(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveAllThresholds(localThresholds);
      alert("Limites atualizados com sucesso!");
      onSaveSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar limites:", error);
      alert("Erro ao salvar limites.");
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentSpending = (category: string) => {
    return expenses
      .filter((e) => e.type === category)
      .reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
  };

  // ✅ Gera o Select com base nas categorias cadastradas no CategoryManagerForm
  const categoryOptions = categories
    .map((c) => c.name)
    .filter((name) => !Object.keys(localThresholds).includes(name))
    .map((name) => ({ label: name, value: name }));

  const sumOfLimits = Object.values(localThresholds).reduce(
    (acc, cur) => acc + (isNaN(cur) ? 0 : cur),
    0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-screen-xl w-full mx-auto">
      <div className="mb-6 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Cadastro de Limite de Gastos
        </h2>
        <p className="text-gray-600">
          Selecione uma categoria cadastrada para definir um limite mensal
        </p>
        {onSaveSuccess && (
          <button
            type="button"
            onClick={onSaveSuccess}
            className="absolute top-0 right-0 text-3xl text-gray-500 hover:text-black cursor-pointer"
          >
            &times;
          </button>
        )}
      </div>

      <form className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select
            id="category"
            label="Tipo de despesa"
            options={categoryOptions}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            placeholder="Selecione uma categoria"
          />
          <Input
            id="limit"
            label="Limite (R$)"
            type="number"
            value={limitValue}
            onChange={(e) => setLimitValue(e.target.value)}
            placeholder="0,00"
          />
          <Button type="button" onClick={handleAddThreshold}>
            Adicionar
          </Button>
        </div>

        {Object.entries(localThresholds).length > 0 && (
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Object.entries(localThresholds).map(([type, value]) => {
              const current = getCurrentSpending(type);
              const percentage =
                value > 0 ? Math.min(current / value, 1) * 100 : 0;

              return (
                <div key={type}>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      {type}
                    </label>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      Gasto atual: R$ {current.toFixed(2)}
                    </span>
                  </div>

                  <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v) && v >= 0) {
                        setLocalThresholds((prev) => ({
                          ...prev,
                          [type]: v,
                        }));
                      }
                    }}
                    className="w-full mt-1 pl-3 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteThreshold(type)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
          <div>
            <h3 className="text-md font-medium text-blue-800">
              Limite total mensal
            </h3>
            <p className="text-sm text-blue-600">
              Soma de todos os limites: R$ {sumOfLimits.toFixed(2)}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-800">R$ 5.000,00</div>
        </div>

        <div className="pt-4">
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar limites"}
          </Button>
        </div>
      </form>
    </div>
  );
}
