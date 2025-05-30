import { useTheme } from "@/context/ThemeContext";
import React, { TextareaHTMLAttributes } from "react";

interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  id,
  error,
  required = false,
  rows = 3,
  ...props
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const inputClassName = `border ${
    isDarkMode
      ? "border-neutral-700 bg-[#2c2c2c] "
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
      <textarea
        id={id}
        rows={rows}
        className={`w-full px-4 py-2 border  rounded-lg ${inputClassName}
                  transition-colors
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

export default TextAreaField;
