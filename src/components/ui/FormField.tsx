import { useTheme } from "@/context/ThemeContext";
import React, { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  required = false,
  type = "text",
  className = "",
  ...props
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const inputClassName = `border ${
    isDarkMode
      ? "border-neutral-700 bg-[#2c2c2c]"
      : "border-neutral-300 bg-white"
  }`;

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-2 ${
          isDarkMode ? "text-neutral-300" : "text-neutral-700"
        }`}
      >
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        id={id}
        type={type}
        className={`w-full px-4 py-2 ${className} ${inputClassName} 
                 ${
                   error
                     ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                     : ""
                 }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default FormField;
