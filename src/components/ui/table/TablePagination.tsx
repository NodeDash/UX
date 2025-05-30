import React from "react";
import { TableThemeColors } from "./types";

interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  pageSizeOptions: number[];
  totalItems: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  themeColors: TableThemeColors;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  pageSize,
  totalPages,
  pageSizeOptions,
  totalItems,
  handlePageChange,
  handlePageSizeChange,
  themeColors,
}) => {
  const { borderColor, inputBgColor, isDarkMode } = themeColors;

  return (
    <div
      className={`border-t border-${borderColor} px-4 py-3 flex items-center justify-between flex-wrap shadow-sm ${
        isDarkMode ? "shadow-gray-900" : "shadow-gray-400"
      }`}
    >
      <div className="flex items-center text-sm text-neutral-400 mb-2 sm:mb-0">
        <span>Show</span>
        <select
          className={`mx-2 border border-${borderColor} bg-${inputBgColor} rounded px-2 py-1`}
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div>

      <div className="flex flex-wrap items-center justify-end">
        <div className="text-sm text-neutral-400 mr-4 hidden sm:block">
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{" "}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
        </div>

        <div className="flex">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border border-${borderColor} rounded-l-md disabled:opacity-50`}
          >
            &laquo;
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border-t border-b border-${borderColor} disabled:opacity-50`}
          >
            &lsaquo;
          </button>

          <span className={`px-3 py-1 border-t border-b border-${borderColor}`}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-3 py-1 border-t border-b border-${borderColor} disabled:opacity-50`}
          >
            &rsaquo;
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className={`px-3 py-1 border border-${borderColor} rounded-r-md disabled:opacity-50`}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};
