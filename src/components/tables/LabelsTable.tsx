import React, { useState, useEffect } from "react";
import { Label } from "@/types/label.types";
import { LabelEditorModal } from "@/components/modals";
import { Table, LabelBadge, TableActions } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import HistoryModal from "@/components/modals/HistoryModal";
import { ErrorMessage } from "../ui/error-message";
import TableColumnActions from "@/components/tables/TableColumnActions";
import { useLabelsTable } from "@/hooks/query/tables/useLabelsTable";

interface LabelsTableProps {
  className?: string;
}

export const LabelsTable: React.FC<LabelsTableProps> = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // History modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyLabelId, setHistoryLabelId] = useState<string>("");
  const [historyLabelName, setHistoryLabelName] = useState<string>("");

  // Parse URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const editLabelId = queryParams.get("edit");

  // Use our custom hook that encapsulates all label-related data operations
  const {
    data: labels,
    isLoading,
    error,
    selectedItem: selectedLabel,
    isEditorOpen,
    handleRefresh,
    openEditor,
    closeEditor,
  } = useLabelsTable();

  // Handle URL-based editing
  useEffect(() => {
    if (editLabelId && labels.length) {
      // Try to match both string and numeric IDs
      const labelToEdit = labels.find(
        (label) => String(label.id) === editLabelId
      );

      if (labelToEdit) {
        openEditor(labelToEdit);
      } else {
        console.warn(`Label with ID ${editLabelId} not found in`, labels);
        // Clear the invalid parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editLabelId, labels]);

  // Handle opening history modal
  const handleOpenHistory = (label: Label) => {
    setHistoryLabelId(label.id);
    setHistoryLabelName(label.name);
    setIsHistoryModalOpen(true);
  };

  // Handle closing history modal
  const handleCloseHistory = () => {
    setIsHistoryModalOpen(false);
  };

  const columns = [
    {
      key: "name",
      header: t("common.name"),
      render: (label: Label) => (
        <>
          <div className="flex items-center gap-2">
            <LabelBadge label={label} onClick={() => openEditor(label)} />
          </div>
        </>
      ),
    },
    {
      key: "devices",
      header: t("common.devices"),
      render: (label: Label) => {
        const device_ids = label.device_ids || [];
        return (
          <div>
            <span className="text-sm">
              {device_ids.length}{" "}
              {device_ids.length !== 1
                ? t("common.devices")
                : t("common.device")}
            </span>
          </div>
        );
      },
    },
    {
      key: "created",
      header: t("common.created"),
      render: (label: Label) => (
        <span className="text-sm">
          {new Date(label.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (label: Label) => (
        <TableColumnActions
          entityId={label.id}
          entityType="label"
          entityName={label.name}
          onEdit={() => openEditor(label)}
          onHistory={() => handleOpenHistory(label)}
        />
      ),
    },
  ];

  const errorMessage = error ? t("labels.failedToLoadLabels") : null;

  return (
    <>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <Table
        columns={columns}
        data={labels}
        isLoading={isLoading}
        emptyMessage={t("labels.noLabels")}
        keyExtractor={(label) => label.id}
        title={t("common.all", {
          name: t("labels.title"),
        })}
        actionButton={
          <TableActions
            onRefresh={handleRefresh}
            onAdd={() => openEditor()}
            addButtonText={t("labels.add")}
          />
        }
      />

      <LabelEditorModal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        initialLabel={selectedLabel || null}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistory}
        labelId={historyLabelId}
        labelName={historyLabelName}
      />
    </>
  );
};

export default LabelsTable;
