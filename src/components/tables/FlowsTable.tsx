import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Flow } from "@/types/flow.types";
import FlowEditorModal from "@/components/modals/FlowEditorModal";
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
import { useFlowsTable } from "@/hooks/query/tables/useFlowsTable";

interface FlowsTableProps {
  className?: string;
}

export const FlowsTable: React.FC<FlowsTableProps> = ({ className = "" }) => {
  const { t } = useTranslation();

  // History modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyFlow, setHistoryFlow] = useState<Flow | null>(null);

  // Use our custom hook that encapsulates all flow-related data operations
  const {
    data: flows,
    isLoading,
    error,
    selectedItem: editingFlow,
    isEditorOpen,
    handleRefresh,
    openEditor,
    closeEditor,
  } = useFlowsTable();

  // Handle opening history modal
  const handleOpenHistory = (flow: Flow) => {
    setHistoryFlow(flow);
    setIsHistoryModalOpen(true);
  };

  // Handle closing history modal
  const handleCloseHistory = () => {
    setIsHistoryModalOpen(false);
    setHistoryFlow(null);
  };

  const filterOptions: TableFilter[] = [
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
  ];

  const columns = [
    {
      key: "name",
      header: t("common.name"),
      render: (flow: Flow) => (
        <>
          <Link
            to={`/flow/${flow.id}`}
            className="hover:text-blue-600"
            title={flow.name}
          >
            <div className="text-lg font-medium text-nowrap">{flow.name}</div>
            <span className="text-sm text-nowrap text-truncate">
              {flow.description}
            </span>
          </Link>
        </>
      ),
    },
    {
      key: "status",
      header: t("common.status"),
      filterable: true,
      // Provide fallback for potentially undefined status
      filterValue: (flow: Flow) => flow.status || "",
      render: (flow: Flow) => <StatusBadge status={flow.status} type="flow" />,
    },
    {
      key: "updated_at",
      header: t("common.last_run"),
      render: (flow: Flow) => (
        <span className="text-sm">
          {new Date(flow.updated_at ?? flow.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (flow: Flow) => (
        <TableColumnActions
          entityId={flow.id}
          entityType="flow"
          entityName={flow.name}
          onEdit={() => openEditor(flow)}
          onHistory={() => handleOpenHistory(flow)}
          onView={() => {}} // View is handled through the Link wrapper
          showView={false}
          customActions={
            <Link
              to={`/flow/${flow.id}`}
              className="p-1.5 px-2 text-xs bg-blue-600 text-white rounded
                     hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              {t("common.view")}
            </Link>
          }
        />
      ),
    },
  ];

  return (
    <>
      {error && (
        <ErrorMessage
          message={error instanceof Error ? error.message : String(error)}
        />
      )}

      <Table
        columns={columns}
        data={flows || []}
        isLoading={isLoading}
        emptyMessage={t("flows.noFlows")}
        keyExtractor={(flow) => flow.id}
        title={t("common.all", {
          name: t("nav.flows"),
        })}
        className={className}
        actionButton={
          <TableActions
            onRefresh={handleRefresh}
            onAdd={() => openEditor()}
            addButtonText={t("flows.add")}
          />
        }
        filterOptions={filterOptions}
      />

      <FlowEditorModal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        flow={editingFlow || undefined}
      />

      {historyFlow && (
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={handleCloseHistory}
          entityId={historyFlow.id}
          entityType="flow"
          entityName={historyFlow.name}
        />
      )}
    </>
  );
};

export default FlowsTable;
