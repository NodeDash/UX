import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const hoverColor = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <div
      ref={selectRef}
      className={`relative ${className}`}
      onClick={() => !disabled && setIsOpen(!isOpen)}
    >
      <div
        id={id}
        className={`flex items-center justify-between w-full px-3 py-2 cursor-pointer border rounded-md ${borderColor} ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${bgColor} ${textColor}`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>

      {isOpen && !disabled && (
        <div
          className={`absolute z-10 w-full mt-1 overflow-auto rounded-md shadow-lg ${bgColor} ${borderColor} border max-h-60`}
          style={{ minWidth: "100%" }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-2 cursor-pointer ${
                option.value === value
                  ? isDarkMode
                    ? "bg-blue-600"
                    : "bg-blue-100"
                  : ""
              } ${hoverColor}`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => children;
export const SelectItem: React.FC<{
  value: string;
  children: React.ReactNode;
}> = ({ children }) => <>{children}</>;
export const SelectTrigger: React.FC<{
  children: React.ReactNode;
  id?: string;
}> = ({ children }) => <>{children}</>;
export const SelectValue: React.FC<{ placeholder?: string }> = ({
  placeholder,
}) => <>{placeholder}</>;

export default Select;
