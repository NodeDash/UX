import React, { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";

/**
 * AuthFormField component - consistent form field styling for auth pages
 */
interface AuthFormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon?: ReactNode;
}

const AuthFormField: React.FC<AuthFormFieldProps> = ({
  id,
  label,
  icon,
  ...props
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-sm font-medium ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        } mb-1`}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`text-gray-500 sm:text-sm`}>{icon}</span>
          </div>
        )}
        <input
          id={id}
          className={`appearance-none ${
            icon ? "pl-10" : "pl-3"
          } pr-3 py-2 border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
          } rounded-md shadow-sm block w-full focus:outline-none focus:ring-2 ${
            isDarkMode ? "focus:ring-blue-500/50" : "focus:ring-blue-500/70"
          } focus:border-blue-500 sm:text-sm`}
          {...props}
        />
      </div>
    </div>
  );
};

export default AuthFormField;
