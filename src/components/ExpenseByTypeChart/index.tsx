"use client";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useExpenses } from "@/contexts/ExpensesContext";
import { useDate } from "@/contexts/DateContext";
import { capitalize } from "@/utils/capitalize";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#d0ed57",
  "#a4de6c",
  "#ff7f50",
  "#a0522d",
];

export const ExpenseByTypeChart = () => {
  const { expenses } = useExpenses();
  const { selectedMonth, selectedYear } = useDate();

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    });
  }, [expenses, selectedYear, selectedMonth]);

  const data = useMemo(() => {
    const totals: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      if (!totals[e.type]) totals[e.type] = 0;
      totals[e.type] += e.amount;
    });

    return Object.entries(totals).map(([type, total]) => ({
      name: capitalize(type),
      value: total,
    }));
  }, [filteredExpenses]);

  const { topCategory, maxValue, lowestCategory, minValue } = useMemo(() => {
    let top = "",
      low = "",
      max = 0,
      min = Infinity;
    data.forEach(({ name, value }) => {
      if (value > max || top === "") {
        max = value;
        top = name;
      }
      if (value < min || low === "") {
        min = value;
        low = name;
      }
    });
    return {
      topCategory: top,
      maxValue: max,
      lowestCategory: low,
      minValue: min,
    };
  }, [data]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl w-[90vw] mx-auto flex flex-col justify-center items-center border-2 border-black">
      <h2 className="text-lg font-bold mb-4 border-b-2 border-green-500">
        Gastos por Tipo
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500 my-10">
          Nenhum registro de despesas neste mês.
        </p>
      ) : (
        <div className="flex w-full justify-between px-16">
          <ul className="text-md w-1/3">
            <li className="mb-2">
              • Maior gasto: <strong>{topCategory}</strong> (R${" "}
              {maxValue.toFixed(2)})
            </li>
            <li>
              • Menor gasto: <strong>{lowestCategory}</strong> (R${" "}
              {minValue.toFixed(2)})
            </li>
          </ul>

          <div className="w-2/3 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 20, right: 40, bottom: 20, left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                <Bar dataKey="value">
                  {data.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
