import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type ActionNode } from "./types";
import { useTheme } from "../../context/ThemeContext";

export function ActionNode({ data }: NodeProps<ActionNode>) {
  const { theme } = useTheme();

  // Background and border colors based on theme
  const backgroundColor = theme === "light" ? "#FFA07A" : "#CD5C5C";
  const borderColor = theme === "light" ? "#000000" : "#FFFFFF";
  const textColor = theme === "light" ? "#333333" : "#ffffff";

  // Darker color for the icon section
  const iconBackgroundColor = theme === "light" ? "#FF6347" : "#B22222";
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
        {/* Default icon if none specified - can be replaced with specific icons based on node type */}
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
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>

      <div className="flex-grow p-3 overflow-hidden">
        {data.label && (
          <div className="font-medium text-sm truncate">{data.label}</div>
        )}
      </div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} id="true" />
    </div>
  );
}
