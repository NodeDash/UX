import React, { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  options,
  error,
  required = false,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-neutral-300 mb-2"
      >
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        id={id}
        className={`w-full px-4 py-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg
                 text-white focus:outline-none focus:border-blue-500
                 focus:ring-1 focus:ring-blue-500 transition-colors
                 ${
                   error
                     ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                     : ""
                 }`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default SelectField;
