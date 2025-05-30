import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type StorageNode } from "./types";
import { useTheme } from "../../context/ThemeContext";

export function StorageNode({ data }: NodeProps<StorageNode>) {
  const { theme } = useTheme();

  // Background and border colors based on theme (blue tones for storage)
  const backgroundColor = theme === "light" ? "#87CEFA" : "#4682B4";
  const borderColor = theme === "light" ? "#000000" : "#FFFFFF";
  const textColor = theme === "light" ? "#333333" : "#ffffff";

  // Darker color for the icon section
  const iconBackgroundColor = theme === "light" ? "#1E90FF" : "#4169E1";
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
      {/* Icon section - takes up approximately 1/4 of the node width */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: "45px",
          backgroundColor: iconBackgroundColor,
          color: iconColor,
        }}
      >
        {/* Database/Storage icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      </div>

      <div className="flex-grow p-3 overflow-hidden">
        {data.label && (
          <div className="font-medium text-sm truncate">{data.label}</div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: borderColor,
          border: `2px solid ${backgroundColor}`,
        }}
      />
    </div>
  );
}
