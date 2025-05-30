import * as React from "react";
import { useTheme } from "@/context/ThemeContext";

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  htmlFor,
  children,
  className = "",
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const textColor = isDarkMode ? "text-gray-200" : "text-gray-700";

  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium mb-1 ${textColor} ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
