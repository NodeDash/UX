import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  className = "",
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Update internal state when checked prop changes
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;

    const newValue = !isChecked;
    setIsChecked(newValue);

    if (onCheckedChange) {
      onCheckedChange(newValue);
    }
  };

  // Define theme-specific styling
  const bgColorChecked = isDarkMode ? "bg-blue-600" : "bg-blue-500";
  const bgColorUnchecked = isDarkMode ? "bg-gray-700" : "bg-gray-300";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={handleToggle}
      className={`
        relative inline-flex shrink-0 h-6 w-11 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${isChecked ? bgColorChecked : bgColorUnchecked}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={disabled}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow 
          transition-transform ease-in-out duration-200
          ${isChecked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
};

export { Switch };
export default Switch;
