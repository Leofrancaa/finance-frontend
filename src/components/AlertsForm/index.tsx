"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useAlertThreshold } from "@/contexts/AlertThresholdContext";
import { EXPENSE_TYPES } from "@/utils/constants";
import { useExpenses } from "@/contexts/ExpensesContext";

export default function AlertThresholdForm({
  onSaveSuccess,
}: {
  onSaveSuccess?: () => void;
}) {
  const { thresholds, saveAllThresholds } = useAlertThreshold();
  const { expenses } = useExpenses();
  const [localThresholds, setLocalThresholds] =
    useState<Record<string, number>>(thresholds);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalThresholds(thresholds);
  }, [thresholds]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: string
  ) => {
    const rawValue = e.target.value;
    const value = rawValue === "" ? 0 : parseFloat(rawValue);

    if (!isNaN(value) && value >= 0) {
      setLocalThresholds((prev) => ({ ...prev, [category]: value }));
    } else if (rawValue === "") {
      setLocalThresholds((prev) => ({ ...prev, [category]: 0 }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveAllThresholds(localThresholds);
      alert("Limites atualizados com sucesso!");
      onSaveSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar limites:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const sumOfLimits = Object.values(localThresholds).reduce(
    (acc, cur) => acc + (isNaN(cur) ? 0 : cur),
    0
  );

  const getCurrentSpending = (category: string) => {
    return expenses
      .filter((e) => e.type === category)
      .reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-screen-xl w-full mx-auto">
      <div className="mb-6  relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Cadastro de Limite de Gastos
        </h2>
        <p className="text-gray-600">
          Defina limites mensais para cada categoria de despesa
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
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {EXPENSE_TYPES.map((type) => (
            <div key={type} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`limit-${type}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {type}
                </label>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Gasto atual: R$ {getCurrentSpending(type).toFixed(2)}
                </span>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  id={`limit-${type}`}
                  name={`limit-${type}`}
                  placeholder="0,00"
                  className="block w-full pl-12 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={
                    localThresholds[type] === 0
                      ? ""
                      : localThresholds[type] ?? ""
                  }
                  onChange={(e) => handleChange(e, type)}
                  disabled={isSaving}
                />
              </div>
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        localThresholds[type] > 0
                          ? Math.min(localThresholds[type] / 1000, 1) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
            {isSaving ? "Salvando..." : "Salvar limites"}
          </Button>
        </div>
      </form>
    </div>
  );
}
