import React from "react";
import { ActionButton } from "./index";
import { RefreshIcon } from "@heroicons/react/outline";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TableActionsProps {
  onRefresh?: () => void;
  onAdd?: () => void;
  addButtonText?: string;
  className?: string;
  hideRefresh?: boolean;
  hideAdd?: boolean;
}

/**
 * Reusable component for table action buttons that typically appear in the top-right of tables
 * Standardizes the layout and appearance of Refresh and Add buttons
 */
const TableActions: React.FC<TableActionsProps> = ({
  onRefresh,
  onAdd,
  addButtonText,
  className = "",
  hideRefresh = false,
  hideAdd = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center ${className}`}>
      {!hideRefresh && onRefresh && (
        <ActionButton
          onClick={() => onRefresh()}
          variant="secondary"
          size="sm"
          className={!hideAdd ? "mr-1" : ""}
        >
          <RefreshIcon className="h-5 w-5 mr-1" />
          {t("common.refresh")}
        </ActionButton>
      )}
      {!hideAdd && onAdd && (
        <ActionButton onClick={() => onAdd()} variant="primary" size="sm">
          <PlusIcon className="h-5 w-5 mr-1" />
          {addButtonText || t("common.add")}
        </ActionButton>
      )}
    </div>
  );
};

export default TableActions;
