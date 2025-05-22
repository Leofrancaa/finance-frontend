import React from "react";

interface SelectProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  value?: string; // ✅ Adicionado
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // ✅ Adicionado
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  options,
  required = false,
  className = "",
  placeholder = "Selecione uma opção",
  icon,
  value, // ✅
  onChange, // ✅
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <select
          id={id}
          name={id}
          value={value} // ✅
          onChange={onChange} // ✅
          className={`
            block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            py-2 px-4 bg-white transition-all duration-200
            appearance-none
            ${icon ? "pl-10" : ""}
            ${className}
            hover:border-gray-400
          `}
          required={required}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
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

export default Select;
