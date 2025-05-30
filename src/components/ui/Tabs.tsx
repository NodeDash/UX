import React from "react";
import { useTheme } from "@/context/ThemeContext";

// Tabs container component
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className = "",
}) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || "");

  React.useEffect(() => {
    if (value) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (newValue: string) => {
    if (!value) {
      setActiveTab(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Clone children with context
  return (
    <div className={`tabs-container ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab,
            onTabChange: handleTabChange,
          });
        }
        return child;
      })}
    </div>
  );
};

// Tabs list component (the header)
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  className = "",
  activeTab,
  onTabChange,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-gray-800" : "bg-gray-100";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  return (
    <div
      className={`flex border rounded-md overflow-hidden ${borderColor} ${bgColor} ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab,
            onTabChange,
          });
        }
        return child;
      })}
    </div>
  );
};

// Tab trigger (button)
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  activeTab,
  onTabChange,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const isActive = activeTab === value;

  const activeBgColor = isDarkMode ? "bg-gray-700" : "bg-white";
  const activeTextColor = isDarkMode ? "text-white" : "text-gray-900";
  const inactiveTextColor = isDarkMode ? "text-gray-400" : "text-gray-700";
  const hoverColor = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200";
  const borderColor = isDarkMode ? "border-gray-600" : "border-gray-300";

  return (
    <button
      className={`px-4 py-2 flex-1 transition-colors duration-200 text-sm font-medium ${borderColor}
        ${
          isActive
            ? `${activeBgColor} ${activeTextColor}`
            : `${inactiveTextColor} ${hoverColor}`
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      disabled={disabled}
      onClick={() => !disabled && onTabChange && onTabChange(value)}
    >
      {children}
    </button>
  );
};

// Content for each tab
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  activeTab,
  className = "",
}) => {
  if (activeTab !== value) return null;

  return <div className={className}>{children}</div>;
};

export default { Tabs, TabsList, TabsTrigger, TabsContent };
