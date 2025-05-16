"use client";
import { useDate } from "@/contexts/DateContext";
import { MONTHS } from "@/utils/constants";

export const MonthButtons = () => {
  const { selectedMonth, setMonth } = useDate();

  return (
    <div className="grid grid-cols-4 gap-3 mt-4 text-black">
      {MONTHS.map((month, i) => (
        <button
          key={i}
          onClick={() => setMonth(i)}
          aria-pressed={selectedMonth === i}
          className={`p-2 rounded-md cursor-pointer transition-colors duration-300 outline-none 
            ${
              selectedMonth === i
                ? "bg-black text-white"
                : "bg-transparent border-2 border-black hover:bg-blue-500 hover:text-white"
            } 
            focus:ring-2 focus:ring-blue-400`}
        >
          {month}
        </button>
      ))}
    </div>
  );
};
