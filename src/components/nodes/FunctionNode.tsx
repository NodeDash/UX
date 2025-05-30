import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type FunctionNode } from "./types";
import { useTheme } from "../../context/ThemeContext";
import { IconCode } from "@tabler/icons-react";

export function FunctionNode({ data }: NodeProps<FunctionNode>) {
  const { theme } = useTheme();

  // Determine status color - red for error/partial_success, green for success, grey for no_history
  const statusColor =
    data.status === "error"
      ? "#e53935"
      : data.status === "partial_success"
      ? "#ff9800" // orange
      : data.status === "success"
      ? "#4caf50" // green
      : data.status === "no_history"
      ? "#9e9e9e" // grey for no history
      : "#9e9e9e"; // default fallback

  // Background and border colors based on theme (purple tones for functions)
  const backgroundColor = theme === "light" ? "#d8b5ff" : "#8a5cb8";
  const borderColor = theme === "light" ? "#000000" : "#FFFFFF";
  const textColor = theme === "light" ? "#333333" : "#ffffff";

  // Darker color for the icon section
  const iconBackgroundColor = theme === "light" ? "#9966cc" : "#6b4c99";
  const iconColor = "#ffffff";

  return (
    <div
      className="react-flow__node-default relative flex rounded-md shadow-md"
      style={{
        backgroundColor,
        borderColor,
        color: textColor,
        padding: 0,

        minWidth: "250px",
        border: `1px solid ${borderColor}`,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      {/* Status indicator circle */}
      <div
        className="absolute top-1 right-1 w-3 h-3 rounded-full border border-gray-400"
        style={{ backgroundColor: statusColor }}
        title={data.status || "Normal"}
      />

      {/* Icon section - takes up approximately 1/4 of the node width */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: "45px",
          backgroundColor: iconBackgroundColor,
          color: iconColor,
        }}
      >
        <IconCode
          size={24}
          className="text-white"
          style={{
            width: "24px",
            height: "24px",
          }}
        />
      </div>

      <div className="flex-grow p-3 overflow-hidden">
        {data.label && (
          <div className="font-medium text-sm truncate">{data.label}</div>
        )}
      </div>
    </div>
  );
}
