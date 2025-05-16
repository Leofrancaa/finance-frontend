"use client";
import { useExpenses } from "@/contexts/ExpensesContext";
import { useDate } from "@/contexts/DateContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { MONTHS } from "@/utils/constants";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a0522d",
  "#8a2be2",
  "#00ced1",
  "#ff1493",
  "#2e8b57",
  "#ff6347",
  "#20b2aa",
  "#9370db",
];

export const MonthlyExpensesChart = () => {
  const { expenses } = useExpenses();
  const { selectedYear } = useDate();

  const monthlyTotals = Array.from({ length: 12 }, (_, month) => {
    const total = expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === selectedYear && d.getMonth() === month;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      name: MONTHS[month].slice(0, 3), // Ex: Jan, Fev, Mar
      value: total,
    };
  });

  const hasData = monthlyTotals.some((m) => m.value > 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl w-[90vw] mx-auto flex flex-col border-2 border-black my-6">
      <h2 className="text-xl font-bold mb-4 self-center border-b-2 border-green-500">
        Gastos Mensais em {selectedYear}
      </h2>

      {hasData ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyTotals}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Bar dataKey="value">
              {monthlyTotals.map((data, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    data.value === 0 ? "#F1F1F1" : COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500 m-12 font-medium">
          Nenhum gasto lançado em {selectedYear}.
        </div>
      )}
    </div>
  );
};
