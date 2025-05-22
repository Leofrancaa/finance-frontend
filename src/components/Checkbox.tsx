import React from "react";

interface CheckboxProps {
  id: string;
  label: string;
  className?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  className = "",
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center mb-4">
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`
          h-4 w-4 rounded border-gray-300 text-blue-600 
          focus:ring-blue-500 transition duration-150 ease-in-out
          cursor-pointer
          ${className}
        `}
      />
      <label
        htmlFor={id}
        className="ml-2 block text-sm text-gray-700 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
