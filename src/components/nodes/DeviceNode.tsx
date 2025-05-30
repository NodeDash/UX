import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type DeviceNode } from "./types";
import { useTheme } from "../../context/ThemeContext";
import { IconDevices } from "@tabler/icons-react";

export function DeviceNode({ data }: NodeProps<DeviceNode>) {
  const { theme } = useTheme();

  // Determine status color - red for error/partial_success, green for success/default
  const statusColor =
    data.status === "error"
      ? "#e53935"
      : data.status === "partial_success"
      ? "#ff9800" // orange
      : data.status === "success"
      ? "#4caf50" // green
      : // default color, grey
        "#9e9e9e";

  // Background and border colors based on theme (gray tones for devices)
  const backgroundColor = theme === "light" ? "#e0e0e0" : "#4a4a4a";
  const borderColor = theme === "light" ? "#000000" : "#FFFFFF";
  const textColor = theme === "light" ? "#333333" : "#ffffff";

  // Darker color for the icon section
  const iconBackgroundColor = theme === "light" ? "#c0c0c0" : "#666666";
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
        <IconDevices
          size={24}
          className="text-white"
          style={{
            width: "24px",
            height: "24px",
          }}
        />
      </div>

      <div className="flex-grow p-3  text-sm ">{data.label}</div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
