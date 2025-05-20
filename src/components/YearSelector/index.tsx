"use client";
import { useDate } from "@/contexts/DateContext";

export const YearSelector = () => {
  const { selectedYear, setYear } = useDate();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i).reverse();

  return (
    <div>
      <label
        htmlFor="year"
        className="block mb-2 text-sm font-medium text-black"
      >
        Selecione o ano
      </label>
      <select
        value={selectedYear}
        onChange={(e) => setYear(Number(e.target.value))}
        className="p-2 border rounded-md bg-white text-black cursor-pointer w-36"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
