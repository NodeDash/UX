import { TableColumn, TableThemeColors } from "./types";

interface TableBodyProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage: string;
  keyExtractor: (item: T) => string;
  isLoading: boolean;
  themeColors: TableThemeColors;
}

export function TableBody<T>({
  columns,
  data,
  emptyMessage,
  keyExtractor,
  isLoading,
  themeColors,
}: TableBodyProps<T>) {
  const { borderColor, hoverBgColorClass } = themeColors;

  if (isLoading) {
    return null;
  }

  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={columns.length}
            className="px-6 py-8 text-center text-sm text-neutral-400"
          >
            {emptyMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={`divide-y divide-${borderColor}`}>
      {data.map((item, index) => (
        <tr
          key={keyExtractor(item)}
          className={`${hoverBgColorClass} transition-colors`}
        >
          {columns.map((column) => (
            <td
              key={`${keyExtractor(item)}-${column.key}`}
              className={`px-6 py-3 text-sm ${column.className || ""}`}
            >
              {column.render(item, index)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
