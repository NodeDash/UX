import React from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/ux/useToast";
import { useIsMobile } from "@/hooks/ux/use-mobile";
import {
  useDeleteDevice,
  useDeleteFlow,
  useDeleteFunction,
  useDeleteIntegration,
  useDeleteLabel,
} from "@/hooks/api";

type EntityType =
  | "integration"
  | "label"
  | "flow"
  | "device"
  | "function"
  | "provider"
  | "team";

interface TableColumnActionsProps {
  entityId: string;
  entityType: EntityType;
  entityName?: string;
  onEdit?: () => void;
  onHistory?: () => void;
  onView?: () => void;
  confirmMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  showEdit?: boolean;
  showHistory?: boolean;
  showView?: boolean;
  showDelete?: boolean;
  customActions?: React.ReactNode;
}

/**
 * Reusable component for table column action buttons
 * Standardizes the layout and appearance of action buttons (Edit, History, View, Delete)
 * Handles delete confirmation and feedback
 */
const TableColumnActions: React.FC<TableColumnActionsProps> = ({
  entityId,
  entityType,
  entityName,
  onEdit,
  onHistory,
  onView,
  confirmMessage,
  successMessage,
  errorMessage,
  showEdit = true,
  showHistory = true,
  showView = false,
  showDelete = true,
  customActions,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const isMobile = useIsMobile();
  const { mutateAsync: deleteIntegration } = useDeleteIntegration();
  const { mutateAsync: deleteFunction } = useDeleteFunction();
  const { mutateAsync: deleteFlow } = useDeleteFlow();
  const { mutateAsync: deleteLabel } = useDeleteLabel();
  const { mutateAsync: deleteDevice } = useDeleteDevice();

  const getDefaultMessages = () => {
    const typeKey = entityType.toLowerCase();
    return {
      confirm:
        confirmMessage ||
        t(
          `${typeKey}s.confirmDelete${
            typeKey.charAt(0).toUpperCase() + typeKey.slice(1)
          }`,
          { name: entityName || "" }
        ),
      success: successMessage || t(`${typeKey}s.${typeKey}Deleted`),
      error: errorMessage || t(`${typeKey}s.failedToDelete`),
    };
  };

  const handleDelete = async () => {
    const messages = getDefaultMessages();

    if (!window.confirm(messages.confirm)) {
      return;
    }

    try {
      //switch based on entityType
      switch (entityType) {
        case "integration":
          await deleteIntegration(entityId);
          break;
        case "label":
          await deleteLabel(entityId);
          break;
        case "flow":
          await deleteFlow(entityId);
          break;
        case "device":
          await deleteDevice(entityId);
          break;
        case "function":
          await deleteFunction(entityId);
          break;
        default:
          throw new Error("Unsupported entity type");
      }
      toast.success(messages.success);
    } catch (err) {
      console.error(`Error deleting ${entityType}:`, err);
      toast.error(messages.error);
    }
  };

  return (
    <div className={`flex gap-2 ${isMobile ? "flex-col" : "flex-row"}`}>
      {customActions}
      {showView && onView && (
        <button
          onClick={onView}
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
        </button>
      )}

      {showEdit && onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 px-2 text-xs bg-green-600 text-white rounded
                   hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          {t("common.edit")}
        </button>
      )}

      {showHistory && onHistory && (
        <button
          onClick={onHistory}
          className="p-1.5 px-2 text-xs bg-gray-600 text-white rounded
                   hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          {t("common.history")}
        </button>
      )}

      {showDelete && (
        <button
          className="p-1.5 px-2 text-xs bg-red-600 text-white rounded
                   hover:bg-red-900 transition-colors flex items-center justify-center gap-1"
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {t("common.delete")}
        </button>
      )}
    </div>
  );
};

export default TableColumnActions;
