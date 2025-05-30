import React, { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";

// Define props for the StatsCardItem component
interface StatsCardItemProps {
  title: string;
  subtitle: string;
  value: number;
  icon: ReactNode;
  color: "green" | "red" | "gray" | "amber";
  removePaddingBottom?: boolean;
}

/**
 * A reusable component for displaying an individual stat item within a StatsCard
 */
const StatsCardItem: React.FC<StatsCardItemProps> = ({
  title,
  subtitle,
  value,
  icon,
  color,
  removePaddingBottom = false,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Determine styling based on color prop
  const getColorClass = () => {
    switch (color) {
      case "green":
        return {
          bg: isDarkMode ? "bg-green-900/30" : "bg-green-100",
          text: "text-green-600",
        };
      case "red":
        return {
          bg: isDarkMode ? "bg-red-900/30" : "bg-red-100",
          text: "text-red-600",
        };
      case "amber":
        return {
          bg: isDarkMode ? "bg-amber-900/30" : "bg-amber-100",
          text: "text-amber-600",
        };
      case "gray":
      default:
        return {
          bg: isDarkMode ? "bg-gray-800/50" : "bg-gray-100",
          text: "text-gray-600",
        };
    }
  };

  const colorClass = getColorClass();

  return (
    <li className={`${removePaddingBottom ? "pt-4" : "py-4"}`}>
      <div className="flex items-center">
        <div className="shrink-0">
          <div
            className={`w-12 h-12 rounded-full p-1.5 ${colorClass.bg} ${colorClass.text}`}
          >
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0 ms-4">
          <p className="text-sm font-medium text-foreground truncate">
            {title}
          </p>
          <p
            className={`text-xs text-muted-foreground truncate ${
              !isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {subtitle}
          </p>
        </div>
        <div
          className={`inline-flex items-center font-semibold text-foreground text-2xl ${colorClass.text}`}
        >
          {value}
        </div>
      </div>
    </li>
  );
};

export default StatsCardItem;
