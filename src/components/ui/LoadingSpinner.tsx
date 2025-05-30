import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  message = "Loading...",
  fullPage = false,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Size mappings
  const sizeMap = {
    sm: { spinner: "w-6 h-6", text: "text-sm" },
    md: { spinner: "w-10 h-10", text: "text-base" },
    lg: { spinner: "w-16 h-16", text: "text-lg" },
  };

  const { spinner: spinnerSize, text: textSize } = sizeMap[size];

  // Colors based on theme
  const spinnerColor = isDarkMode ? "border-blue-500" : "border-blue-600";
  const textColor = isDarkMode ? "text-gray-200" : "text-gray-700";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullPage ? "h-full w-full" : ""
      }`}
    >
      <div
        className={`${spinnerSize} rounded-full border-4 border-t-transparent ${spinnerColor} animate-spin`}
        role="status"
        aria-label="loading"
      ></div>
      {message && (
        <p className={`${textSize} ${textColor} font-medium`}>{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
