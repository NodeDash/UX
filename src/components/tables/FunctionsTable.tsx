import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomFunction } from "@/types/function.types";
import { Table, StatusBadge, TableActions } from "@/components/ui";
import { FunctionEditorModal } from "@/components/modals";
import HistoryModal from "@/components/modals/HistoryModal";
import { TableFilter } from "@/components/ui/table";
import { ErrorMessage } from "../ui/error-message";
import TableColumnActions from "@/components/tables/TableColumnActions";
import { useFunctionsTable } from "@/hooks/query/tables/useFunctionsTable";

interface FunctionsTableProps {
  className?: string;
}

export const FunctionsTable: React.FC<FunctionsTableProps> = ({
  className = "",
}) => {
  const { t } = useTranslation();

  // History modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyFunctionId, setHistoryFunctionId] = useState<string>("");
  const [historyFunctionName, setHistoryFunctionName] = useState<string>("");

  // Use our custom hook that encapsulates all function-related data operations
  const {
    data: functions,
    isLoading,
    error,
    selectedItem: selectedFunction,
    isEditorOpen,
    handleRefresh,
    openEditor,
    closeEditor,
  } = useFunctionsTable();

  // Handle opening history modal
  const handleOpenHistory = (func: CustomFunction) => {
    setHistoryFunctionId(func.id);
    setHistoryFunctionName(func.name);
    setIsHistoryModalOpen(true);
  };

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
  ];

  const columns = [
    {
      key: "name",
      header: t("common.name"),
      filterable: true,
      filterValue: (func: CustomFunction) => func.name || "",
      render: (func: CustomFunction) => (
        <>
          <div className="text-sm font-medium">
            <button
              onClick={() => openEditor(func)}
              className="hover:text-blue-600"
              title={func.name}
            >
              {func.name}
            </button>
          </div>
        </>
      ),
    },
    {
      key: "status",
      header: t("common.status"),
      filterable: true,
      filterValue: (func: CustomFunction) => func.status || "",
      render: (func: CustomFunction) => (
        <StatusBadge status={func.status} type="function" />
      ),
    },
    {
      key: "updated_at",
      header: t("common.last_run"),
      render: (func: CustomFunction) => (
        <span className="text-sm">
          {new Date(func.updated_at ?? func.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      className: "text-right",
      render: (func: CustomFunction) => (
        <TableColumnActions
          entityId={func.id}
          entityType="function"
          entityName={func.name}
          onEdit={() => openEditor(func)}
          onHistory={() => handleOpenHistory(func)}
        />
      ),
    },
  ];

  const errorMessage = error?.message;

  return (
    <>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <Table
        columns={columns}
        data={functions}
        isLoading={isLoading}
        emptyMessage={t("functions.noFunctions")}
        keyExtractor={(item) => item.id}
        title={t("common.all", {
          name: t("functions.title"),
        })}
        className={className}
        actionButton={
          <TableActions
            onRefresh={handleRefresh}
            onAdd={() => openEditor()}
            addButtonText={t("functions.add")}
          />
        }
        filterOptions={filterOptions}
      />

      <FunctionEditorModal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        initialFunction={selectedFunction || undefined}
        onRefresh={handleRefresh}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        entityId={historyFunctionId}
        entityType="function"
        entityName={historyFunctionName}
      />
    </>
  );
};

export default FunctionsTable;
