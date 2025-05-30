import React from "react";
import { TableFilter, TableThemeColors } from "./types";
import ActionButton from "../ActionButton";

interface TableHeaderProps {
  title?: string;
  filterOptions?: TableFilter[];
  filters: Record<string, string>;
  filterVisible: boolean;
  setFilterVisible: (visible: boolean) => void;
  clearFilters: () => void;
  actionButton?: React.ReactNode;
  themeColors: TableThemeColors;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  filterOptions,
  filters,
  filterVisible,
  setFilterVisible,
  clearFilters,
  actionButton,
  themeColors,
}) => {
  const activeFilterCount = Object.keys(filters).length;

  if (!filterOptions || filterOptions.length === 0) {
    return (
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {actionButton && <div>{actionButton}</div>}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mb-4 px-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex items-center">
        <FilterControls
          activeFilterCount={activeFilterCount}
          filterVisible={filterVisible}
          setFilterVisible={setFilterVisible}
          clearFilters={clearFilters}
          themeColors={themeColors}
        />
        {actionButton && <div className="ml-1">{actionButton}</div>}
      </div>
    </div>
  );
};

interface FilterControlsProps {
  activeFilterCount: number;
  filterVisible: boolean;
  setFilterVisible: (visible: boolean) => void;
  clearFilters: () => void;
  themeColors?: TableThemeColors;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  activeFilterCount,
  filterVisible,
  setFilterVisible,
  clearFilters,
}) => {
  return (
    <div className="flex items-center">
      {activeFilterCount > 0 && (
        <span className="mr-2 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
        </span>
      )}

      {activeFilterCount > 0 && (
        <ActionButton
          onClick={clearFilters}
          variant="primary"
          size="sm"
          className="mr-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear
        </ActionButton>
      )}

      <ActionButton
        onClick={() => setFilterVisible(!filterVisible)}
        variant="secondary"
        size="sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filter
        {activeFilterCount > 0 && (
          <span className="ml-1 text-xs bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </ActionButton>
    </div>
  );
};
