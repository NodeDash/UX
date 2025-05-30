import { ReactNode } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface TableFilter {
  key: string;
  label: string;
  options?: FilterOption[];
}

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  render: (item: T, index: number) => ReactNode;
  className?: string;
  sortable?: boolean;
  sortKey?: string;
  filterable?: boolean;
  filterValue?: (item: T) => string;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface TableThemeColors {
  borderColor: string;
  hoverBgColorClass: string;
  inputBgColor: string;
  textColor: string;
  bgColor: string;
  buttonBgColor: string;
  buttonHoverBgColor: string;
  activeButtonBgColor: string;
  activeButtonTextColor: string;
  isDarkMode: boolean;
  shadowColor: string;
}