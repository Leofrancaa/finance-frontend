import {
  CreditCard,
  TrendingUp,
  CalendarDays,
  Maximize2,
  AlertTriangle,
  BarChart3,
  Zap,
} from "lucide-react";
import { useExpenseDashboardStats } from "@/hooks/useExpenseDashboardStats";

export default function ExpensesCard() {
  const {
    totalCurrent,
    percentChange,
    numExpenses,
    dailyMean,
    forecast,
    maxExpense,
    categoriesExceeded,
  } = useExpenseDashboardStats();

  return (
    <section className="w-full max-w-[47.5vw] bg-white shadow-lg rounded-lg p-6 space-y-4 border border-gray-200">
      <div className="flex items-center gap-3">
        <CreditCard className="w-8 h-8 text-red-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Resumo de Despesas
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <InfoItem
          icon={<TrendingUp className="text-blue-600 w-5 h-5" />}
          label="Total do mês"
          value={`R$ ${totalCurrent.toFixed(2)}`}
        />
        <InfoItem
          icon={<BarChart3 className="text-indigo-600 w-5 h-5" />}
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
          icon={<CalendarDays className="text-emerald-600 w-5 h-5" />}
          label="Despesas registradas"
          value={`${numExpenses} ${
            numExpenses === 1 ? "lançamento" : "lançamentos"
          }`}
        />
        <InfoItem
          icon={<Maximize2 className="text-purple-600 w-5 h-5" />}
          label="Maior despesa"
          value={`R$ ${maxExpense.amount.toFixed(2)} em ${maxExpense.type}`}
        />
        <InfoItem
          icon={<Zap className="text-yellow-600 w-5 h-5" />}
          label="Média por dia"
          value={`R$ ${dailyMean.toFixed(2)}`}
        />
        <InfoItem
          icon={<TrendingUp className="text-rose-600 w-5 h-5" />}
          label="Previsão do mês"
          value={`R$ ${forecast.toFixed(2)}`}
        />
      </div>

      <div className="pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
          <AlertTriangle className="text-yellow-600 w-4 h-4" />
          Categorias acima do limite:
        </h3>
        {categoriesExceeded.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhuma categoria passou do limite definido.
          </p>
        ) : (
          <ul className="list-disc list-inside text-sm text-red-700">
            {categoriesExceeded.map((c) => (
              <li key={c.type}>
                {c.type} — R$ {c.total.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
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
