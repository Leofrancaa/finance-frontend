"use client";

import { useAlertThreshold } from "@/contexts/AlertThresholdContext";
import { EXPENSE_TYPES } from "@/utils/constants";
import { useState, useEffect } from "react";

export const AlertThresholdForm = ({
  onSaveSuccess,
}: {
  onSaveSuccess?: () => void;
}) => {
  const { thresholds, isLoading, saveAllThresholds } = useAlertThreshold();
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
      onSaveSuccess?.(); // ✅ Fecha modal ao salvar
    } catch (error) {
      console.error("Erro ao salvar limites no formulário:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !Object.keys(thresholds).length) {
    return (
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg border shadow-md w-full md:w-auto">
        <h2 className="text-xl font-semibold text-gray-800">
          Configurar Limites de Gastos
        </h2>
        <p className="text-gray-600">Carregando limites...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg border shadow-md w-full md:w-auto">
      <h2 className="text-xl font-semibold text-gray-800">
        Configurar Limites de Gastos Mensais
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Defina valores máximos para receber alertas quando os gastos se
        aproximarem.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {EXPENSE_TYPES.map((category) => (
          <div key={category} className="flex flex-col gap-1">
            <label
              htmlFor={`threshold-${category}`}
              className="text-sm font-medium text-gray-700 capitalize"
            >
              {category}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                R$
              </span>
              <input
                id={`threshold-${category}`}
                type="number"
                value={
                  localThresholds[category] === 0
                    ? ""
                    : localThresholds[category] ?? ""
                }
                onChange={(e) => handleChange(e, category)}
                className="border border-gray-300 p-2 pl-9 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                min={0}
                step={50}
                placeholder="Ex: 500"
                disabled={isSaving}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className={`py-2 px-6 rounded-md font-semibold text-white transition-colors duration-200 ${
            isSaving || isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSaving ? "Salvando..." : "Salvar Limites"}
        </button>
      </div>
    </div>
  );
};
