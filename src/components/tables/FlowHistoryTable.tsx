// filepath: /Users/neilskoglund/flow-manual/src/components/ui/FlowHistoryTable.tsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/ux/useToast";
import { useFlowHistory } from "@/hooks/api";
import { ActionButton, ErrorMessage, HistoryTable } from "../ui";
import { RefreshIcon } from "@heroicons/react/outline";
import { HistoryItem } from "./HistoryTable";

interface FlowHistoryTableProps {
  flowId?: string;
  className?: string;
}

const FlowHistoryTable: React.FC<FlowHistoryTableProps> = ({
  flowId,
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
  } = useFlowHistory(flowId);

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
        entityType="flow"
        isLoading={isLoading}
        title={flowId ? t("flows.flowHistory") : t("flows.allFlowHistory")}
        emptyMessage={t("history.noRecords")}
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

export default FlowHistoryTable;
