// filepath: /Users/neilskoglund/flow-manual/src/components/ui/IntegrationHistoryTable.tsx
import React, { useMemo } from "react";
import { HistoryTable, HistoryItem } from "./HistoryTable";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/ux/useToast";
import { useIntegrationHistory } from "@/hooks/api";
import { ActionButton, ErrorMessage } from "../ui";
import { RefreshIcon } from "@heroicons/react/outline";

interface IntegrationHistoryTableProps {
  integrationId?: string; // Made optional to allow showing all integrations history
  className?: string;
}

const IntegrationHistoryTable: React.FC<IntegrationHistoryTableProps> = ({
  integrationId,
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
  } = useIntegrationHistory(integrationId);

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
        entityType="integration"
        isLoading={isLoading}
        emptyMessage={t("history.noRecords")}
        title={
          integrationId
            ? t("integrations.integrationHistory")
            : t("integrations.allIntegrationHistory")
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

export default IntegrationHistoryTable;
