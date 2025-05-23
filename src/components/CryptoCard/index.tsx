import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface CryptoCardProps {
  name: string;
  symbol: string;
  icon: string;
  quantity: number;
  invested: number;
  currentPrice: number;
  variation24h: number;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  name,
  symbol,
  icon,
  quantity,
  invested,
  currentPrice,
  variation24h,
}) => {
  const currentValue = quantity * currentPrice;
  const profit = currentValue - invested;
  const profitPercent = (profit / invested) * 100 || 0;
  const isProfit = profit >= 0;

  return (
    <div className="w-[260px] bg-white border border-gray-200 rounded-md shadow-md p-5 flex flex-col gap-3 text-gray-800">
      <div className="flex items-center gap-3">
        <Image src={icon} alt={name} width={32} height={32} />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">({symbol})</p>
        </div>
      </div>

      <div className="text-sm space-y-1 mt-1">
        <p>
          Quantidade: <strong>{quantity}</strong>
        </p>
        <p>
          Preço atual:{" "}
          <strong>R$ {currentPrice.toLocaleString("pt-BR")}</strong>
        </p>
        <p>
          Investido: <strong>R$ {invested.toLocaleString("pt-BR")}</strong>
        </p>
        <p>
          Valor atual:{" "}
          <strong>
            R${" "}
            {currentValue.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </strong>
        </p>
        <p
          className={`font-semibold ${
            isProfit ? "text-green-600" : "text-red-600"
          }`}
        >
          {isProfit ? (
            <ArrowUpRight className="inline w-4 h-4" />
          ) : (
            <ArrowDownRight className="inline w-4 h-4" />
          )}{" "}
          {isProfit ? "Lucro" : "Prejuízo"}: R$ {Math.abs(profit).toFixed(2)} (
          {profitPercent.toFixed(2)}%)
        </p>
        <p
          className={`text-xs ${
            variation24h >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          Variação 24h: {variation24h >= 0 ? "+" : ""}
          {variation24h.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default CryptoCard;
