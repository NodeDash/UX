import { TableColumn, SortConfig } from "./types";

interface TableSortHeaderProps<T> {
  columns: TableColumn<T>[];
  sortConfig: SortConfig | null;
  handleSort: (column: TableColumn<T>) => void;
}

export function TableSortHeader<T>({
  columns,
  sortConfig,
  handleSort,
}: TableSortHeaderProps<T>) {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider 
              ${column.sortable !== false ? "cursor-pointer" : ""}
              ${column.className || ""}`}
            onClick={() => handleSort(column)}
          >
            <div className="flex items-center">
              {column.header}
              {column.sortable !== false && (
                <span className="ml-1">
                  <SortIndicator column={column} sortConfig={sortConfig} />
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

interface SortIndicatorProps<T> {
  column: TableColumn<T>;
  sortConfig: SortConfig | null;
}

function SortIndicator<T>({ column, sortConfig }: SortIndicatorProps<T>) {
  if (column.sortable === false) return null;

  const sortKey = column.sortKey || column.key;
  const isSorted = sortConfig && sortConfig.key === sortKey;

  if (!isSorted) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {sortConfig?.direction === "asc" ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      )}
    </svg>
  );
}
