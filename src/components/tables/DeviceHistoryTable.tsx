import React from "react";
import { DeviceHistoryEntry } from "../../types/device-history.types";
import {
  Table,
  StatusBadge,
  JsonViewer,
  ActionButton,
  ErrorMessage,
} from "../ui";
import { useTranslation } from "react-i18next";
import { useDeviceHistory } from "@/hooks/api";
import { useToast } from "@/hooks/ux/useToast";
import { RefreshIcon } from "@heroicons/react/outline";
import { TableFilter } from "../ui/table";

interface DeviceHistoryTableProps {
  deviceId?: string; // Optional: if provided, only show history for this device
  flowId?: string; // Optional: if provided, filter history by flow
  className?: string;
  limit?: number; // Optional: limit number of entries
}

const DeviceHistoryTable: React.FC<DeviceHistoryTableProps> = ({
  deviceId,
  flowId,
  className = "",
  limit,
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  // Use React Query hook with improved configuration
  const {
    data: historyData = [],
    isLoading,
    error,
    refetch,
  } = useDeviceHistory(deviceId, flowId);

  const filterOptions: TableFilter[] = [
    {
      key: "event",
      label: t("devices.event"),
      options: [
        { value: "uplink", label: t("common.uplink") },
        { value: "join", label: t("common.join") },
        { value: "online", label: t("devices.online") },
        { value: "offline", label: t("devices.offline") },
      ],
    },
  ];

  // Apply limit and sorting if needed
  const historyEntries = React.useMemo(() => {
    // Filter out flow_execution entries - they shouldn't be in device history
    let filtered = (historyData as DeviceHistoryEntry[]).filter(
      (entry) => entry.event !== "flow_execution"
    );

    // Apply limit if specified
    if (limit && filtered.length > limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [historyData, limit]);

  const handleRefresh = () => {
    refetch();
    toast.info(t("common.refreshing"));
  };

  // Helper function to get appropriate badge for event type
  const getEventBadge = (
    event: DeviceHistoryEntry["event"],
    data: DeviceHistoryEntry["data"]
  ) => {
    switch (event) {
      case "uplink":
        return <StatusBadge status="uplink" type="deviceHistory" />;
      case "join":
        return <StatusBadge status="join" type="deviceHistory" />;
      case "status_change": {
        const status = data?.status || "unknown";
        return <StatusBadge status={status} type="deviceHistory" />;
      }
      default:
        return <StatusBadge status={event} type="deviceHistory" />;
    }
  };

  const columns = [
    {
      key: "timestamp",
      header: t("common.timestamp"),
      render: (entry: DeviceHistoryEntry) => (
        <span className="text-sm">
          {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "N/A"}
        </span>
      ),
    },

    // Only show device name column when displaying history for multiple devices
    ...(deviceId
      ? []
      : [
          {
            key: "deviceName",
            header: t("common.name"),
            render: (entry: DeviceHistoryEntry) => {
              return (
                <span className="text-sm font-medium">
                  {entry.device?.name || entry.device_id}
                </span>
              );
            },
          },
        ]),

    {
      key: "event",
      header: t("devices.event"),
      render: (entry: DeviceHistoryEntry) => (
        <div>{getEventBadge(entry.event || "unknown", entry.data)}</div>
      ),
      filterable: true,
      // Updated filterValue to handle status_change events
      filterValue: (entry: DeviceHistoryEntry) => {
        if (entry.event === "status_change") {
          return entry.data?.status || ""; // Return the status from data
        }
        return entry.event || ""; // Return the event name otherwise
      },
    },
    {
      key: "details",
      header: t("common.details"),
      render: (entry: DeviceHistoryEntry) => {
        return entry.data ? (
          <JsonViewer data={entry.data} />
        ) : (
          <span className="text-gray-500">No details</span>
        );
      },
    },
  ];

  return (
    <div className={`mt-4 ${className}`}>
      <ErrorMessage message={error instanceof Error ? error.message : null} />
      <Table
        columns={columns}
        data={historyEntries}
        isLoading={isLoading}
        emptyMessage={t("devices.noHistoryFound")}
        keyExtractor={(entry) =>
          String(entry.id || entry.device_id || Math.random())
        }
        title={
          deviceId
            ? t("devices.deviceHistory")
            : flowId
            ? t("devices.flowDeviceHistory")
            : t("devices.allDeviceHistory")
        }
        actionButton={
          <ActionButton onClick={handleRefresh} variant="secondary" size="sm">
            <RefreshIcon className={`h-5 w-5 mr-1`} />
            {t("common.refresh")}
          </ActionButton>
        }
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default DeviceHistoryTable;
