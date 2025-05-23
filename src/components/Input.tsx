import React from "react";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  icon?: React.ReactNode;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number; // ✅ suporte adicionado
  name?: string; // ✅ suporte adicionado
  min?: string; // ✅ suporte adicionado
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  placeholder = "",
  required = false,
  className = "",
  icon,
  value,
  onChange,
  maxLength,
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
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            py-2 px-4 bg-white transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${className}
            hover:border-gray-400
          `}
          required={required}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};

export default Input;
