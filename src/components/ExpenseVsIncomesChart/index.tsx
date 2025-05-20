"use client";

import { useExpenses } from "@/contexts/ExpensesContext";
import { useIncomes } from "@/contexts/IncomesContext";
import { useDate } from "@/contexts/DateContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxisProps,
} from "recharts";
import { MONTHS } from "@/utils/constants";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface ChartData {
  month: string;
  despesas: number;
  receitas: number;
}

interface CustomizedTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

const CustomizedTick = ({ x = 0, y = 0, payload }: CustomizedTickProps) => {
  if (!payload) return null;
  return (
    <text
      x={x}
      y={y}
      dy={16}
      textAnchor="middle"
      fontSize={12}
      transform={`rotate(-30, ${x}, ${y})`}
      fill="#333"
    >
      {payload.value}
    </text>
  );
};

export default function ExpensesVsIncomesChart() {
  const { expenses } = useExpenses();
  const { incomes } = useIncomes();
  const { selectedYear } = useDate();

  const monthlyData: ChartData[] = Array.from({ length: 12 }, (_, month) => {
    const totalDespesas = expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === selectedYear && d.getMonth() === month;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const totalReceitas = incomes
      .filter((i) => {
        const d = new Date(i.date);
        return d.getFullYear() === selectedYear && d.getMonth() === month;
      })
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      month: MONTHS[month],
      despesas: totalDespesas,
      receitas: totalReceitas,
    };
  });

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Receitas vs Despesas</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={monthlyData}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={<CustomizedTick />} />
          <YAxis />
          <Tooltip
            formatter={(value: ValueType) =>
              typeof value === "number" ? `R$ ${value.toFixed(2)}` : value
            }
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="receitas"
            stroke="#0ea5e9"
            fillOpacity={1}
            fill="url(#colorReceitas)"
            name="Receitas"
          />
          <Area
            type="monotone"
            dataKey="despesas"
            stroke="#f97316"
            fillOpacity={1}
            fill="url(#colorDespesas)"
            name="Despesas"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
