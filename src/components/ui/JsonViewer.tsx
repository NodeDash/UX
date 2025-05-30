import React, { useState } from "react";
import {
  ClipboardIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import { useTheme } from "@/context/ThemeContext";

interface JsonViewerProps {
  data: Record<string, any>;
  maxPreviewLength?: number;
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  maxPreviewLength = 50,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);
  const previewText =
    jsonString.length > maxPreviewLength
      ? `${jsonString.substring(0, maxPreviewLength)}...`
      : jsonString;

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
  };

  // Apply different styles based on theme
  const buttonHoverClass = isDarkMode
    ? "hover:bg-gray-700"
    : "hover:bg-gray-200";

  const codeBlockClass = isDarkMode
    ? "bg-gray-800 text-gray-200"
    : "bg-gray-100 text-gray-800";

  return (
    <div
      className={`relative font-mono text-xs ${
        isDarkMode ? "text-gray-300" : "text-gray-700"
      }`}
    >
      <div className="flex items-start">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`mr-1 p-1 rounded ${buttonHoverClass}`}
          aria-label={isExpanded ? "Collapse JSON" : "Expand JSON"}
        >
          {isExpanded ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </button>
        <div className="flex-grow overflow-hidden">
          {isExpanded ? (
            <pre
              className={`p-2 rounded overflow-auto max-h-30 max-w-7xl ${codeBlockClass}`}
            >
              {jsonString}
            </pre>
          ) : (
            <pre className="truncate">{previewText}</pre>
          )}
        </div>
        <button
          onClick={handleCopy}
          className={`ml-2 p-1 rounded ${buttonHoverClass}`}
          title="Copy to clipboard"
          aria-label="Copy JSON to clipboard"
        >
          <ClipboardIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default JsonViewer;
