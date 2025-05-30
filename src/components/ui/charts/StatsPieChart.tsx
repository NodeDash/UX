import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Type for a single data point in the pie chart
interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

// Props interface for the component
interface StatsPieChartProps {
  data: ChartDataItem[];
  size?: number;
  innerRadius?: number;
  outerRadius?: number;
}

/**
 * A reusable ring-shaped pie chart component that displays stats data
 * with colored segments corresponding to different status types.
 */
const StatsPieChart: React.FC<StatsPieChartProps> = ({
  data,
  size = 100,
  innerRadius = 70,
  outerRadius = 90,
}) => {
  // Filter out any items with 0 value to avoid rendering empty segments
  const nonZeroData = data.filter((item) => item.value > 0);

  // If all items are 0, show an empty gray ring
  if (nonZeroData.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div
          className="rounded-full border-4 border-gray-200 dark:border-gray-700"
          style={{ width: outerRadius, height: outerRadius }}
        />
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={nonZeroData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={1}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {nonZeroData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsPieChart;
