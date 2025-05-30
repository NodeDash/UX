import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  className = "",
}) => {
  // Base classes
  let buttonClasses =
    "font-medium rounded-sm transition-colors flex items-center gap-2 ";

  // Size classes
  switch (size) {
    case "sm":
      buttonClasses += "px-3 py-1  text-sm  ";
      break;
    case "lg":
      buttonClasses += "px-5 py-3 text-base ";
      break;
    default: // 'md'
      buttonClasses += "px-4 py-2 text-sm ";
  }

  // Variant classes
  switch (variant) {
    case "secondary":
      buttonClasses += "bg-gray-600 hover:bg-gray-800 text-white ";
      break;
    case "danger":
      buttonClasses += "bg-red-600 text-white hover:bg-red-700 ";
      break;
    default: // 'primary'
      buttonClasses += "bg-blue-600 text-white hover:bg-blue-700 ";
  }

  // Disabled
  if (disabled || isLoading) {
    buttonClasses += "opacity-50 cursor-not-allowed ";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${buttonClasses} ${className}`}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ActionButton;
