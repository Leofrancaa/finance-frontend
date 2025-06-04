import { Clock } from "lucide-react";

export default function InvestimentosCard({
  totalInvestido,
  percentChange,
}: {
  totalInvestido: number;
  percentChange: number;
}) {
  const formattedValor = totalInvestido.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedPercent = percentChange.toFixed(0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 w-[25%] shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-800">
          Investimentos
        </span>
        <Clock className="w-4 h-4 text-purple-600" />
      </div>

      <p className="text-2xl font-bold text-purple-600 mb-1">
        R$ {formattedValor}
      </p>

      <p className="text-sm text-gray-500">
        +{formattedPercent}% em relação ao mês passado
      </p>
    </div>
  );
}
