import React from "react";
import { useTranslation } from "react-i18next";
import JsonViewer from "../ui/JsonViewer";
import { Device } from "../../types/device.types";
import Table from "../ui/table";
import StatusBadge from "../ui/StatusBadge";

export interface HistoryItem {
  id: string | number;
  entity_id?: string;
  entity_type?: "function" | "integration" | "flow" | "label";
  action?: string;
  user_id?: string;
  user_name?: string;
  timestamp: string;
  details?: string;

  data?: Record<string, any>;
  // Function-specific properties
  function_id?: string;
  function?: {
    id: string | number;
    name: string;
  };
  label?: {
    id: string | number;
    name: string;
  };
  flow?: {
    id: string | number;
    name: string;
  };
  integration?: {
    id: string | number;
    name: string;
  };
  device?: {
    id: string | number;
    name: string;
  };
  status?: "success" | "error" | "partial";
  input_data?: Record<string, any>;
  output_data?: Record<string, any>;
  error_message?: string;
  execution_time?: number;
  // Integration-specific properties
  integrationId?: string | number;
  integrationName?: string;
  responseData?: Record<string, any>;
  errorMessage?: string;
  inputData?: Record<string, any>;
  // Flow-specific properties
  flow_id?: number;
  trigger_source?: string;
  source_id?: number;
  execution_path?: Array<any>;
  error_details?: Record<string, any>;
  start_time?: string;
  end_time?: string;
  // Legacy flow fields
  flowName?: string;
  triggerSource?: string;
  sourceId?: number;
  executionPath?: Array<{
    trigger_node: string;
    target_node: string;
    result: {
      node_id: string;
      type: string;
      status: string;
      function_result?: string;
      function_error?: string;
      function_history_id?: number;
      modified_payload?: Record<string, any>;
      next_nodes?: Array<any>;
      integration_result?: {
        status: string;
        status_code: number;
        url: string;
        method: string;
        response_content: string;
        elapsed_ms: number;
        result_category: string;
      };
    };
  }>;
  errorDetails?: any;
  startTime?: string;
  endTime?: string;
  executionTimeMs?: number;
  // Label-specific properties
  labelId?: string;
  labelName?: string;
  flowId?: string;
}

interface HistoryTableProps {
  history: HistoryItem[];
  entityType?: "function" | "integration" | "flow" | "label";
  title?: string;
  isLoading?: boolean;
  deviceMap?: Map<string, Device>;
  emptyMessage?: string;
  actionButton?: React.ReactNode;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  history,
  entityType,
  isLoading = false,
  emptyMessage,
  title,
  actionButton,
}) => {
  const { t } = useTranslation();

  const getColumns = () => {
    // Common columns for all entity types
    const commonColumns = [
      {
        key: "timestamp",
        header: t("common.timestamp"),
        render: (item: HistoryItem) => (
          <span>{new Date(item.timestamp).toLocaleString()}</span>
        ),
      },
    ];

    // Function-specific columns
    if (entityType === "function") {
      return [
        ...commonColumns,
        {
          key: "function",
          header: t("common.name"),
          render: (item: HistoryItem) => {
            return (
              <span className="font-medium">{item?.function?.name || "-"}</span>
            );
          },
        },
        {
          key: "status",
          filterable: true,
          filterValue: (item: HistoryItem) => item.status || "",
          header: t("common.status"),
          render: (item: HistoryItem) => (
            <StatusBadge status={item.status || "unknown"} type="function" />
          ),
        },

        {
          key: "execution_time",
          header: t("functions.executionTime"),
          render: (item: HistoryItem) => (
            <span>
              {item.execution_time ? `${item.execution_time}ms` : "-"}
            </span>
          ),
        },
        {
          key: "input_data",
          header: t("functions.inputData"),
          render: (item: HistoryItem) =>
            item.input_data ? (
              <JsonViewer data={item.input_data} maxPreviewLength={15} />
            ) : (
              <span className="text-gray-500">-</span>
            ),
        },
        {
          key: "output_data",
          header: t("functions.outputData"),
          render: (item: HistoryItem) => {
            // Check if we have an error first

            if (item.error_message) {
              return <div className="text-red-500">{item.error_message}</div>;
            }

            // Handle output_data that could be a string or object
            if (item.output_data) {
              return (
                <JsonViewer data={item.output_data} maxPreviewLength={20} />
              );
            }

            return <div className="text-red-500">{"-"}</div>;
          },
        },
      ];
    }

    // Integration-specific columns
    if (entityType === "integration") {
      return [
        ...commonColumns,
        {
          key: "integration_id",
          header: t("common.name"),
          render: (item: HistoryItem) => {
            return (
              <span className="font-medium">
                {item?.integration?.name || "-"}
              </span>
            );
          },
        },
        {
          key: "status",
          filterable: true,
          filterValue: (item: HistoryItem) => item.status || "",
          header: t("common.status"),
          render: (item: HistoryItem) => (
            <StatusBadge status={item.status || "unknown"} type="integration" />
          ),
        },
        {
          key: "executionTimeMs",
          header: t("integrations.executionTime"),
          render: (item: HistoryItem) => (
            <span>
              {item.executionTimeMs ? `${item.executionTimeMs}ms` : "-"}
            </span>
          ),
        },
        {
          key: "inputData",
          header: t("integrations.inputData"),
          render: (item: HistoryItem) =>
            item.inputData ? (
              <JsonViewer data={item.inputData} maxPreviewLength={20} />
            ) : (
              <span className="text-gray-500">-</span>
            ),
        },
        {
          key: "responseData",
          header: t("integrations.responseData"),
          render: (item: HistoryItem) => {
            // Check if we have an error first
            if (item.status === "error" || item.errorMessage) {
              return (
                <div className="text-red-500">{item.errorMessage || "-"}</div>
              );
            }

            // Handle responseData that could be a string or object
            if (item.responseData) {
              // If it's a string "{}" check and return empty message
              if (
                typeof item.responseData === "string" &&
                item.responseData === "{}"
              ) {
                return <span className="text-gray-500">-</span>;
              }
              return (
                <JsonViewer data={item.responseData} maxPreviewLength={20} />
              );
            }

            return <span className="text-gray-500">-</span>;
          },
        },
      ];
    }

    // Flow-specific columns
    if (entityType === "flow") {
      return [
        {
          key: "timestamp",
          header: t("common.timestamp"),
          render: (item: HistoryItem) => (
            <span>
              {new Date(
                item.timestamp || item.start_time || ""
              ).toLocaleString()}
            </span>
          ),
        },

        {
          key: "flow_id",
          header: t("common.name"),
          render: (item: HistoryItem) => {
            return (
              <span className="font-medium">{item?.flow?.name || "-"}</span>
            );
          },
        },

        {
          key: "trigger_source",
          header: t("flows.triggerSource"),
          render: (item: HistoryItem) => (
            <span className="font-medium">{item.trigger_source || "-"}</span>
          ),
        },
        {
          key: "status",
          filterable: true,
          filterValue: (item: HistoryItem) => item.status || "",
          header: t("common.status"),
          render: (item: HistoryItem) => (
            <StatusBadge status={item.status || "unknown"} type="flow" />
          ),
        },
        {
          key: "execution_time",
          header: t("flows.executionTime"),
          render: (item: HistoryItem) => (
            <span>
              {item.execution_time ? `${item.execution_time}ms` : "-"}
            </span>
          ),
        },
        {
          key: "input_data",
          header: t("flows.inputData"),
          render: (item: HistoryItem) => (
            <div>
              {!item.input_data ? (
                <span className="text-gray-500">-</span>
              ) : (
                <JsonViewer data={item.input_data} maxPreviewLength={20} />
              )}
            </div>
          ),
        },
        {
          key: "output_data",
          header: t("flows.outputData"),
          render: (item: HistoryItem) => (
            <div>
              {!item.output_data ? (
                <span className="text-gray-500">-</span>
              ) : (
                <JsonViewer data={item.output_data} maxPreviewLength={20} />
              )}
            </div>
          ),
        },
        {
          key: "execution_path",
          header: t("flows.executionPath"),
          render: (item: HistoryItem) => (
            <div>
              {!item.execution_path ? (
                <span className="text-gray-500">-</span>
              ) : (
                <JsonViewer data={item.execution_path} maxPreviewLength={20} />
              )}
            </div>
          ),
        },
        {
          key: "error_details",
          header: t("flows.errorDetails"),
          render: (item: HistoryItem) => (
            <div className="text-red-500">
              {item.error_details ? (
                <JsonViewer data={item.error_details} maxPreviewLength={20} />
              ) : (
                "-"
              )}
            </div>
          ),
        },
      ];
    }

    if (entityType === "label") {
      return [
        {
          key: "id",
          header: t("common.id"),
          render: (item: HistoryItem) => (
            <span className="font-medium">{item.id || "-"}</span>
          ),
        },
        {
          key: "label_id",
          header: t("common.name"),
          render: (item: HistoryItem) => {
            return (
              <span className="font-medium">{item?.label?.name || "-"}</span>
            );
          },
        },
        {
          key: "status",
          filterable: true,
          filterValue: (item: HistoryItem) => item.status || "",
          header: t("common.status"),
          render: (item: HistoryItem) => (
            <StatusBadge status={item.status || "unknown"} type="label" />
          ),
        },
        {
          key: "timestamp",
          header: t("common.timestamp"),
          render: (item: HistoryItem) => (
            <span>{new Date(item.timestamp || "").toLocaleString()}</span>
          ),
        },
        {
          key: "device_id",
          header: t("devices.device"),
          render: (item: HistoryItem) => {
            return (
              <span className="font-medium">{item?.device?.name || "-"}</span>
            );
          },
        },
        {
          key: "flow_name",
          header: t("flows.flowName"),
          render: (item: HistoryItem) => (
            <span className="font-medium">{item?.data?.flow_name || "-"}</span>
          ),
        },
      ];
    }

    // Default columns for other entity types
    return [
      ...commonColumns,
      {
        key: "user",
        header: t("common.user"),
        render: (item: HistoryItem) => (
          <span>{item.user_name || item.user_id}</span>
        ),
      },
      {
        key: "details",
        header: t("common.details"),
        render: (item: HistoryItem) => (
          <span className="text-sm">{item.details || "-"}</span>
        ),
      },
    ];
  };

  return (
    <Table
      columns={getColumns()}
      data={history}
      isLoading={isLoading}
      emptyMessage={emptyMessage || t("history.noRecords")}
      keyExtractor={(item) => String(item.id)}
      title={title || t("history.history")}
      actionButton={actionButton}
      filterOptions={[
        {
          key: "status",
          label: t("common.status"),
          options: [
            { value: "success", label: t("common.success") },
            { value: "error", label: t("common.error") },
            { value: "partial_success", label: t("common.partialSuccess") },
          ],
        },
      ]}
    />
  );
};
