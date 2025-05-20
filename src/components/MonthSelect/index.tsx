"use client";
import { useDate } from "@/contexts/DateContext";
import { MONTHS } from "@/utils/constants";

export const MonthSelect = () => {
  const { selectedMonth, setMonth } = useDate();

  return (
    <div>
      <label
        htmlFor="month"
        className="block mb-2 text-sm font-medium text-black"
      >
        Selecione o mês
      </label>
      <select
        id="month"
        value={selectedMonth}
        onChange={(e) => setMonth(Number(e.target.value))}
        className="w-36 p-2 border border-black rounded-md text-black focus:ring-2 focus:ring-blue-400"
      >
        {MONTHS.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};
