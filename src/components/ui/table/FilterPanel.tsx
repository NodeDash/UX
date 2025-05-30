import React from "react";
import { TableFilter, TableThemeColors } from "./types";

interface FilterPanelProps {
  filterOptions: TableFilter[];
  filters: Record<string, string>;
  handleFilterChange: (key: string, value: string) => void;
  visible: boolean;
  themeColors: TableThemeColors;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filterOptions,
  filters,
  handleFilterChange,
  visible,
  themeColors,
}) => {
  if (!visible || !filterOptions || filterOptions.length === 0) {
    return null;
  }

  const {
    borderColor,
    inputBgColor,
    buttonBgColor,
    buttonHoverBgColor,
    activeButtonBgColor,
    activeButtonTextColor,
  } = themeColors;

  return (
    <div
      className={`p-4 mx-4 mb-4 rounded-md border border-${borderColor} bg-${inputBgColor}`}
    >
      <div className="flex flex-wrap gap-4">
        {filterOptions.map((filter) => (
          <div key={filter.key} className="flex flex-col">
            <label className="text-sm font-medium mb-1">{filter.label}</label>
            {filter.options ? (
              <div className="flex flex-wrap gap-1">
                {/* Default "Any" option */}
                <button
                  onClick={() => handleFilterChange(filter.key, "")}
                  className={`text-xs px-3 py-1 rounded-md ${
                    !filters[filter.key]
                      ? `${activeButtonBgColor} ${activeButtonTextColor}`
                      : `${buttonBgColor} ${buttonHoverBgColor}`
                  }`}
                >
                  Any
                </button>

                {/* Predefined filter options */}
                {filter.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(filter.key, option.value)}
                    className={`text-xs px-3 py-1 rounded-md ${
                      filters[filter.key] === option.value
                        ? `${activeButtonBgColor} ${activeButtonTextColor}`
                        : `${buttonBgColor} ${buttonHoverBgColor}`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={filters[filter.key] || ""}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className={`border border-${borderColor} bg-${inputBgColor} rounded px-2 py-1 text-sm`}
                placeholder={`Filter by ${filter.label}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
