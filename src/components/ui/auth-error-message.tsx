import React from "react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

/**
 * AuthErrorMessage component - displays errors in authentication pages
 */
interface AuthErrorMessageProps {
  message: string | null;
}

const AuthErrorMessage: React.FC<AuthErrorMessageProps> = ({ message }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  if (!message) return null;

  return (
    <div
      className={`rounded-md ${isDarkMode ? "bg-red-900/20" : "bg-red-50"} p-4`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className={`h-5 w-5 text-red-400`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3
            className={`text-sm font-medium ${
              isDarkMode ? "text-red-200" : "text-red-800"
            }`}
          >
            {message}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorMessage;
