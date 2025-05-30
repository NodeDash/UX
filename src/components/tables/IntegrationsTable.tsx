import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Integration } from "@/types/integration.types";
import IntegrationEditorModal from "@/components/modals/IntegrationEditorModal";
import HistoryModal from "@/components/modals/HistoryModal";
import {
  ErrorMessage,
  Table,
  StatusBadge,
  TableActions,
} from "@/components/ui";
import { useTranslation } from "react-i18next";
import { TableFilter } from "@/components/ui/table";
import TableColumnActions from "@/components/tables/TableColumnActions";
import { useIntegrationsTable } from "@/hooks/query/tables/useIntegrationsTable";

interface IntegrationsTableProps {
  className?: string;
}

export const IntegrationsTable: React.FC<IntegrationsTableProps> = ({
  className = "",
}) => {
  const { t } = useTranslation();
  const location = useLocation();

  // History modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyIntegrationId, setHistoryIntegrationId] = useState<string>("");
  const [historyIntegrationName, setHistoryIntegrationName] =
    useState<string>("");

  // URL query parameter handling for direct editing
  const queryParams = new URLSearchParams(location.search);
  const editIntegrationId = queryParams.get("edit");

  // Use our custom hook that encapsulates all integration-related data operations
  const {
    data: integrations,
    isLoading,
    error,
    selectedItem: selectedIntegration,
    isEditorOpen,
    handleRefresh,
    openEditor,
    closeEditor,
  } = useIntegrationsTable();

  // Handle URL-based editing
  useEffect(() => {
    if (editIntegrationId && integrations.length > 0) {
      const integrationToEdit = integrations.find(
        (integration) => String(integration.id) === editIntegrationId
      );

      if (integrationToEdit) {
        openEditor(integrationToEdit);
      } else {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editIntegrationId, integrations]);

  // Handle opening history modal
  const handleOpenHistory = (integration: Integration) => {
    setHistoryIntegrationId(integration.id);
    setHistoryIntegrationName(integration.name);
    setIsHistoryModalOpen(true);
  };

  // Handle closing history modal
  const handleCloseHistory = () => {
    setIsHistoryModalOpen(false);
  };

  // Handle editor close (with URL state cleanup)
  const handleCloseEditor = () => {
    closeEditor();
    if (editIntegrationId) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  };

  // Table filter options
  const filterOptions: TableFilter[] = [
    {
      key: "name",
      label: t("common.name"),
    },
    {
      key: "status",
      label: t("common.status"),
      options: [
        { value: "success", label: t("common.success") },
        { value: "error", label: t("common.error") },
        { value: "pending", label: t("common.pending") },
        { value: "partial_success", label: t("common.partialSuccess") },
      ],
    },
    {
      key: "type",
      label: t("common.type"),
      options: [
        { value: "http", label: t("integrations.http") },
        { value: "mqtt", label: t("integrations.mqtt") },
      ],
    },
  ];

  // Table columns definition
  const columns = [
    {
      key: "name",
      header: t("common.name"),
      filterable: true,
      filterValue: (integration: Integration) => integration.name || "",
      render: (integration: Integration) => (
        <>
          <div className="text-sm font-medium">
            <Link
              to={`/integration/${integration.id}`}
              className="hover:text-blue-600"
              title={integration.name}
            >
              {integration.name}
            </Link>
          </div>
        </>
      ),
    },
    {
      key: "status",
      header: t("common.status"),
      filterable: true,
      filterValue: (integration: Integration) => integration.status || "",
      render: (integration: Integration) => (
        <StatusBadge type="integration" status={integration.status} />
      ),
    },
    {
      key: "type",
      header: t("common.type"),
      filterable: true,
      filterValue: (integration: Integration) => integration.type || "",
      render: (integration: Integration) => (
        <div className="text-sm">{integration.type}</div>
      ),
    },
    {
      key: "details",
      header: t("common.details"),
      render: (integration: Integration) => {
        const url =
          typeof integration.config.url === "string"
            ? integration.config.url
            : "-";
        return <span className="text-sm">{url}</span>;
      },
    },
    {
      key: "updated_at",
      header: t("common.last_run"),
      render: (integration: Integration) => (
        <span className="text-sm">
          {new Date(integration.updated_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (integration: Integration) => (
        <TableColumnActions
          entityId={integration.id}
          entityType="integration"
          entityName={integration.name}
          onEdit={() => openEditor(integration)}
          onHistory={() => handleOpenHistory(integration)}
        />
      ),
    },
  ];

  return (
    <>
      {error && <ErrorMessage message={error.message} />}

      <Table
        columns={columns}
        data={integrations}
        isLoading={isLoading}
        emptyMessage={t("integrations.emptyMessage")}
        keyExtractor={(integration) => integration.id}
        title={t("common.all", {
          name: t("integrations.title"),
        })}
        className={className}
        actionButton={
          <TableActions
            onRefresh={handleRefresh}
            onAdd={() => openEditor()}
            addButtonText={t("integrations.add")}
          />
        }
        filterOptions={filterOptions}
      />

      <IntegrationEditorModal
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        integration={selectedIntegration || undefined}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistory}
        entityId={historyIntegrationId}
        entityType="integration"
        entityName={historyIntegrationName}
      />
    </>
  );
};

export default IntegrationsTable;
