// filepath: /Users/neilskoglund/flow-manual/src/components/ui/LabelHistoryTable.tsx
import React from "react";
import { HistoryTable, HistoryItem } from "./HistoryTable";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/ux/useToast";
import { useLabelHistory } from "@/hooks/api";
import { ActionButton, ErrorMessage } from "../ui";
import { RefreshIcon } from "@heroicons/react/outline";

interface LabelHistoryTableProps {
  labelId?: string; // Optional: if provided, only show history for this label
  className?: string;
  flowId?: string; // Optional: if provided, filter history by flow
}

const LabelHistoryTable: React.FC<LabelHistoryTableProps> = ({
  labelId,
  className = "",
  flowId,
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  // Use React Query hook with improved error handling
  const {
    data: historyData = [],
    isLoading,
    error,
    refetch,
  } = useLabelHistory(labelId, flowId);

  const handleRefresh = () => {
    refetch();
    toast.info(t("common.refreshing"));
  };

  return (
    <div className={`mt-6 ${className}`}>
      <ErrorMessage message={error instanceof Error ? error.message : null} />
      <HistoryTable
        history={historyData as HistoryItem[]}
        entityType="label"
        isLoading={isLoading}
        emptyMessage={t("history.noRecords")}
        title={
          labelId
            ? t("labels.labelHistory")
            : flowId
            ? t("labels.flowLabelHistory")
            : t("labels.allLabelHistory")
        }
        actionButton={
          <ActionButton
            onClick={handleRefresh}
            variant="secondary"
            size="sm"
            className="mr-1"
          >
            <RefreshIcon className={`h-5 w-5 mr-1`} />
            {t("common.refresh")}
          </ActionButton>
        }
      />
    </div>
  );
};

export default LabelHistoryTable;
