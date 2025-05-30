import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { TableHeader } from "./TableHeader";
import { FilterPanel } from "./FilterPanel";
import { TableSortHeader } from "./TableSortHeader";
import { TableBody } from "./TableBody";
import { TablePagination } from "./TablePagination";
import { TableLoadingState } from "./TableLoadingState";
import {
  TableColumn,
  TableFilter,
  SortConfig,
  TableThemeColors,
} from "./types";

export type { TableFilter } from "./types";

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
  className?: string;
  paginated?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  useUrlParams?: boolean;
  defaultFilters?: Record<string, string>;
  filterOptions?: TableFilter[];
  title?: string;
  actionButton?: React.ReactNode;
}

function Table<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found.",
  title = "",
  keyExtractor,
  className = "",
  paginated = true,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  useUrlParams = false,
  defaultFilters = {},
  filterOptions = [],
  actionButton = null,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [filters, setFilters] =
    useState<Record<string, string>>(defaultFilters);
  const [filterVisible, setFilterVisible] = useState(false);

  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isDarkMode = theme.theme === "dark";

  // Theme colors
  const themeColors: TableThemeColors = {
    borderColor: isDarkMode ? "[#2c2c2c]" : "gray-200",
    hoverBgColorClass: isDarkMode ? "hover:bg-[#252525]" : "hover:bg-[#f5f5f5]",
    inputBgColor: isDarkMode ? "[#1c1c1c]" : "[#fafafa]",
    textColor: isDarkMode ? "text-white" : "text-gray-900",
    bgColor: isDarkMode ? "[#18181b]" : "gray-50",
    buttonBgColor: isDarkMode ? "bg-gray-700" : "bg-gray-200",
    buttonHoverBgColor: isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-300",
    activeButtonBgColor: isDarkMode ? "bg-blue-700" : "bg-blue-500",
    shadowColor: isDarkMode ? "shadow-gray-900" : "shadow-gray-200",
    activeButtonTextColor: "text-white",
    isDarkMode: isDarkMode,
  };

  // Handle URL parameters
  useEffect(() => {
    if (useUrlParams) {
      const params = new URLSearchParams(location.search);

      // Read sort parameters
      const sortKey = params.get("sortKey");
      const sortDirection = params.get("sortDirection");
      if (sortKey && sortDirection) {
        setSortConfig({
          key: sortKey,
          direction: sortDirection as "asc" | "desc",
        });
      }

      // Check for filter=X&value=Y format
      const filter = params.get("filter");
      const value = params.get("value");
      if (filter && value) {
        setFilters({ [filter]: value });
      } else {
        // Check for filter_key=value format for each filterable column
        const newFilters: Record<string, string> = {};
        columns.forEach((column) => {
          if (column.filterable) {
            const filterValue = params.get(`filter_${column.key}`);
            if (filterValue) {
              newFilters[column.key] = filterValue;
            }
          }
        });

        // Only update filters if we found any
        if (Object.keys(newFilters).length > 0) {
          setFilters(newFilters);
        }
      }
    }
  }, [useUrlParams, location.search, columns]);

  // Update URL parameters
  useEffect(() => {
    if (useUrlParams) {
      const params = new URLSearchParams();

      // Keep sorting parameters in URL
      if (sortConfig) {
        params.set("sortKey", sortConfig.key);
        params.set("sortDirection", sortConfig.direction);
      }

      // Keep filter parameters in URL
      Object.keys(filters).forEach((key) => {
        params.set(`filter_${key}`, filters[key]);
      });

      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [useUrlParams, sortConfig, filters, navigate, location.pathname]);

  // Calculate total pages
  const totalPages = useMemo(
    () => (paginated ? Math.max(1, Math.ceil(data.length / pageSize)) : 1),
    [data.length, pageSize, paginated]
  );

  // Handle sorting
  const handleSort = (column: TableColumn<T>) => {
    if (column.sortable === false) return;

    const sortKey = column.sortKey || column.key;

    if (sortConfig && sortConfig.key === sortKey) {
      if (sortConfig.direction === "asc") {
        setSortConfig({
          key: sortKey,
          direction: "desc",
        });
      } else {
        setSortConfig(null);
      }
    } else {
      setSortConfig({
        key: sortKey,
        direction: "asc",
      });
    }

    if (paginated) {
      setCurrentPage(1);
    }
  };

  // Handle filtering
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prevFilters) => {
      // If the value is empty, remove the filter
      if (!value) {
        const newFilters = { ...prevFilters };
        delete newFilters[key];
        return newFilters;
      }
      return {
        ...prevFilters,
        [key]: value,
      };
    });
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  // Apply filters and sorting
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.keys(filters).forEach((key) => {
      const column = columns.find((col) => col.key === key);
      if (column && column.filterable && column.filterValue) {
        result = result.filter((item) =>
          column.filterValue!(item)
            .toLowerCase()
            .includes(filters[key].toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a: T, b: T) => {
        const getNestedValue = (obj: any, path: string): any => {
          const keys = path.split(".");
          return keys.reduce(
            (o: any, key: string) =>
              o && o[key] !== undefined ? o[key] : null,
            obj as any
          );
        };

        let aValue: any = getNestedValue(a, sortConfig.key);
        let bValue: any = getNestedValue(b, sortConfig.key);

        if (typeof aValue === "function") aValue = aValue.call(a);
        if (typeof bValue === "function") bValue = bValue.call(b);

        if (aValue === null || aValue === undefined) {
          if (bValue === null || bValue === undefined) return 0;
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        if (bValue === null || bValue === undefined) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue instanceof Date && bValue instanceof Date) {
          const aTime = aValue.getTime();
          const bTime = bValue.getTime();
          return sortConfig.direction === "asc" ? aTime - bTime : bTime - aTime;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          if (
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(aValue) &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(bValue)
          ) {
            const aDate = new Date(aValue);
            const bDate = new Date(bValue);

            if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
              const aTime = aDate.getTime();
              const bTime = bDate.getTime();
              return sortConfig.direction === "asc"
                ? aTime - bTime
                : bTime - aTime;
            }
          }
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          const aNum = aValue ? 1 : 0;
          const bNum = bValue ? 0 : 1;
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }

        return 0;
      });
    }

    return result;
  }, [data, filters, columns, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (paginated) {
      const startIndex = (currentPage - 1) * pageSize;
      return processedData.slice(startIndex, startIndex + pageSize);
    }
    return processedData;
  }, [processedData, currentPage, pageSize, paginated]);

  // Page change handler
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Page size change handler
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div
      className={`rounded-lg shadow overflow-hidden bg-${themeColors.bgColor} ${className} ${themeColors.textColor} pt-4 ${themeColors.shadowColor}`}
    >
      <TableHeader
        title={title}
        filterOptions={filterOptions}
        filters={filters}
        filterVisible={filterVisible}
        setFilterVisible={setFilterVisible}
        clearFilters={clearFilters}
        actionButton={actionButton}
        themeColors={themeColors}
      />

      <FilterPanel
        filterOptions={filterOptions || []}
        filters={filters}
        handleFilterChange={handleFilterChange}
        visible={filterVisible}
        themeColors={themeColors}
      />

      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y divide-${themeColors.borderColor}`}
        >
          <TableSortHeader
            columns={columns}
            sortConfig={sortConfig}
            handleSort={handleSort}
          />
          <TableBody
            columns={columns}
            data={paginatedData}
            emptyMessage={emptyMessage}
            keyExtractor={keyExtractor}
            isLoading={isLoading}
            themeColors={themeColors}
          />
        </table>
      </div>

      {paginated && data.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          pageSizeOptions={pageSizeOptions}
          totalItems={processedData.length}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          themeColors={themeColors}
        />
      )}

      {isLoading && <TableLoadingState />}
    </div>
  );
}

export default Table;
