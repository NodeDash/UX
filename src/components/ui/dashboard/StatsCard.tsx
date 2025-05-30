import React, { ReactNode } from "react";
import StatsPieChart from "@/components/ui/charts/StatsPieChart";
import { useTheme } from "@/context/ThemeContext";

// Define the chart data item type
export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

// Define props for the StatsCard component
interface StatsCardProps {
  title: string;
  icon: ReactNode;
  chartData: ChartDataItem[];
  children: ReactNode;
}

/**
 * A reusable stats card component that displays a title, chart, and stats items
 */
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  icon,
  chartData,
  children,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div
      className={`w-full p-4 rounded-lg shadow-sm sm:p-8 ${
        !isDarkMode
          ? "bg-[#fbf9fa] border-gray-200 shadow-2xl shadow-gray-400"
          : "bg-[#18181b] border-gray-700 shadow-2xl shadow-gray-900"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <h5
          className={`text-xl font-bold leading-none ${
            !isDarkMode ? "text-gray-900" : "text-white"
          }`}
        >
          <div className="flex items-center">
            <div className="h-10 w-10 mr-2 text-blue-600">{icon}</div>
            {title}
          </div>
        </h5>
      </div>

      {/* Chart Section */}
      <div className="flex justify-center mb-4">
        <StatsPieChart
          data={chartData}
          size={120}
          innerRadius={50}
          outerRadius={60}
        />
      </div>

      {/* Stats Items */}
      <div className="flow-root">
        <ul
          role="list"
          className={`divide-y ${
            !isDarkMode ? "divide-gray-200" : "divide-gray-700"
          }`}
        >
          {children}
        </ul>
      </div>
    </div>
  );
};

export default StatsCard;
