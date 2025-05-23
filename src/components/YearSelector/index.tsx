"use client";
import { useDate } from "@/contexts/DateContext";

export const YearSelector = () => {
  const { selectedYear, setYear } = useDate();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i).reverse();

  return (
    <div className="relative">
      <label
        htmlFor="year-selector" // Changed ID for consistency
        className="block mb-2 text-sm font-semibold text-gray-700" // Text for label is dark gray
      >
        Selecione o ano
      </label>
      <div className="relative inline-block w-40">
        <select
          id="year-selector" // Matched htmlFor with id
          value={selectedYear}
          onChange={(e) => setYear(Number(e.target.value))}
          // Optimized classes for a white background
          className="appearance-none block w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 pl-3 pr-8 text-base text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-150"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {/* Custom arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
