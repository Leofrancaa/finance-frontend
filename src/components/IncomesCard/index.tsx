import {
  Banknote,
  TrendingUp,
  CalendarCheck,
  Maximize2,
  CalendarDays,
  Trophy,
} from "lucide-react";
import { useIncomeDashboardStats } from "@/hooks/useIncomeDashboardStats";

export default function IncomeCard() {
  const {
    totalCurrent,
    percentChange,
    numIncomes,
    daysWithIncome,
    maxIncome,
    metaAtingida,
    restanteMeta,
    meta,
  } = useIncomeDashboardStats();

  return (
    <section className="w-full max-w-[47.5vw] bg-white shadow-lg rounded-lg p-6 space-y-4 border border-gray-200">
      <div className="flex items-center gap-3">
        <Banknote className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Resumo de Receitas
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <InfoItem
          icon={<Banknote className="text-green-600 w-5 h-5" />}
          label="Total do mês"
          value={`R$ ${totalCurrent.toFixed(2)}`}
        />
        <InfoItem
          icon={<TrendingUp className="text-indigo-600 w-5 h-5" />}
          label="Comparado ao mês anterior"
          value={
            percentChange !== null
              ? `${percentChange > 0 ? "⬆️" : "⬇️"} ${Math.abs(
                  percentChange
                ).toFixed(2)}%`
              : "N/A"
          }
        />
        <InfoItem
          icon={<CalendarCheck className="text-emerald-600 w-5 h-5" />}
          label="Lançamentos registrados"
          value={`${numIncomes}`}
        />
        <InfoItem
          icon={<Maximize2 className="text-purple-600 w-5 h-5" />}
          label="Maior receita"
          value={`R$ ${maxIncome.amount.toFixed(2)}`}
        />
        <InfoItem
          icon={<CalendarDays className="text-yellow-600 w-5 h-5" />}
          label="Dias com receita"
          value={`${daysWithIncome}`}
        />
        <InfoItem
          icon={
            <Trophy
              className={metaAtingida ? "text-green-600" : "text-gray-500"}
            />
          }
          label="Meta mensal"
          value={
            metaAtingida
              ? `🎉 Atingida (R$ ${meta.toFixed(2)})`
              : `Faltam R$ ${restanteMeta.toFixed(2)}`
          }
        />
      </div>
    </section>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
      <div className="pt-1">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-base font-semibold text-gray-800">{value}</span>
      </div>
    </div>
  );
}
