// filepath: /Users/neilskoglund/flow-manual/src/components/ui/FunctionHistoryTable.tsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/ux/useToast";
import { useFunctionHistory } from "@/hooks/api";
import { ActionButton, ErrorMessage, HistoryTable } from "../ui";
import { HistoryItem } from "./HistoryTable";
import { RefreshIcon } from "@heroicons/react/outline";

interface FunctionHistoryTableProps {
  functionId?: string; // Made optional to allow showing all functions history
  className?: string;
}

const FunctionHistoryTable: React.FC<FunctionHistoryTableProps> = ({
  functionId,
  className = "",
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  // Use React Query hook instead of manually managing state and refetching
  const {
    data: historyData = [],
    isLoading,
    error,
    refetch,
  } = useFunctionHistory(functionId || ""); // Provide empty string as fallback

  // Process history data if needed
  const history = useMemo(() => {
    return historyData as HistoryItem[];
  }, [historyData]);

  const handleRefresh = () => {
    refetch();
    toast.info(t("common.refreshing"));
  };

  return (
    <div className={`mt-4 ${className}`}>
      <ErrorMessage message={error instanceof Error ? error.message : null} />
      <HistoryTable
        history={history}
        entityType="function"
        isLoading={isLoading}
        emptyMessage={t("history.noRecords")}
        title={
          functionId
            ? t("functions.functionHistory")
            : t("functions.allFunctionHistory")
        }
        actionButton={
          <ActionButton
            onClick={() => {
              handleRefresh();
            }}
            variant="secondary"
            size="sm"
          >
            <RefreshIcon className="h-5 w-5 mr-1" />
            {t("common.refresh")}
          </ActionButton>
        }
      />
    </div>
  );
};

export default FunctionHistoryTable;
