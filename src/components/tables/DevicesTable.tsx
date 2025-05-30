import React, { useState, useEffect } from "react";
import { Device } from "@/types/device.types";
import DeviceEditorModal from "@/components/modals/DeviceEditorModal";
import DeviceLabels from "@/components/ui/DeviceLabels";
import { Table, StatusBadge, TableActions } from "@/components/ui";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDeviceHistoryTimestamp } from "@/hooks/ux/useDeviceHistoryTimestamp";
import { LabelEditorModal } from "@/components/modals";
import { useDevicesTable } from "@/hooks/query/tables/useDevicesTable";
import { TableFilter } from "@/components/ui/table";
import HistoryModal from "@/components/modals/HistoryModal";
import { ErrorMessage } from "../ui/error-message";
import TableColumnActions from "@/components/tables/TableColumnActions";

interface DevicesTableProps {
  className?: string;
}

const LastSeenDisplay: React.FC<{ device: Device }> = ({ device }) => {
  const { t } = useTranslation();
  const { lastSeenTimestamp, isLoading } = useDeviceHistoryTimestamp(device.id);

  if (isLoading) {
    return <span className="text-sm">{t("common.pleaseWait")}</span>;
  }

  return (
    <span className="text-sm">
      {lastSeenTimestamp.timestamp
        ? lastSeenTimestamp.formattedTime
        : t("common.never")}
    </span>
  );
};

export const DevicesTable: React.FC<DevicesTableProps> = ({
  className = "",
}) => {
  const { t } = useTranslation();
  const location = useLocation();

  // Additional state for device-specific functionality
  const [isLabelEditorOpen, setIsLabelEditorOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState<Device | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [initialFilters, setInitialFilters] = useState<Record<string, string>>(
    {}
  );
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyDeviceId, setHistoryDeviceId] = useState<string>("");
  const [historyDeviceName, setHistoryDeviceName] = useState<string>("");

  // Use our custom hook that encapsulates all device-related data operations
  const { data: devices, isLoading, error, handleRefresh } = useDevicesTable();

  // Handle URL parameters for filtering
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");
    const value = params.get("value");

    if (filter && value) {
      setInitialFilters({ [filter]: value });
    }
  }, [location.search]);

  // Handle opening the device editor
  const handleOpenEditDevice = (device: Device) => {
    setDeviceToEdit(device);
    setIsLabelEditorOpen(false);
    setIsEditorOpen(true);
  };

  // Handle opening history modal
  const handleOpenHistory = (device: Device) => {
    setHistoryDeviceId(device.id);
    setHistoryDeviceName(device.name);
    setIsHistoryModalOpen(true);
  };

  // State for editor modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Define filter options for the Table
  const filterOptions: TableFilter[] = [
    {
      key: "status",
      label: t("common.status"),
      options: [
        { value: "online", label: t("common.online") },
        { value: "offline", label: t("common.offline") },
        { value: "never_seen", label: t("common.neverSeen") },
      ],
    },
    {
      key: "name",
      label: t("common.name"),
      // No options = text input
    },
    {
      key: "dev_eui",
      label: t("devices.dev_eui"),
      // No options = text input
    },
  ];

  const columns = [
    {
      key: "name",
      header: t("common.name"),
      sortable: true,
      filterable: true,
      filterValue: (device: Device) => device.name,
      render: (device: Device) => (
        <Link
          to={`/device/${device.id}`}
          className="text-blue-500 hover:underline font-medium"
        >
          {device.name}
        </Link>
      ),
    },
    {
      key: "dev_eui",
      header: t("devices.dev_eui"),
      sortable: true,
      filterable: true,
      filterValue: (device: Device) => device.dev_eui,
      render: (device: Device) => (
        <span className="font-mono text-sm text-gray-400">
          {device.dev_eui}
        </span>
      ),
    },
    {
      key: "status",
      header: t("common.status"),
      sortable: true,
      filterable: true,
      filterValue: (device: Device) => device.status,
      render: (device: Device) => (
        <div className="flex items-center">
          <StatusBadge status={device.status} type="device" />
        </div>
      ),
    },
    {
      key: "labels",
      header: t("common.labels"),
      render: (device: Device) => (
        <div className="flex flex-wrap gap-1">
          <DeviceLabels deviceId={device.id} />
        </div>
      ),
    },
    {
      key: "last_seen",
      header: t("devices.lastSeen"),
      sortable: true,
      sortKey: "last_seen_at",
      render: (device: Device) => <LastSeenDisplay device={device} />,
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (device: Device) => (
        <TableColumnActions
          entityId={device.id}
          entityType="device"
          entityName={device.name}
          onEdit={() => handleOpenEditDevice(device)}
          onHistory={() => handleOpenHistory(device)}
          customActions={
            <Link
              to={`/device/${device.id}`}
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

  // Handle error messages
  const errorMessage = error || null;

  return (
    <>
      {errorMessage && (
        <ErrorMessage
          message={
            errorMessage instanceof Error
              ? errorMessage.message
              : t("common.error")
          }
        />
      )}
      <Table
        columns={columns}
        data={devices}
        isLoading={isLoading}
        emptyMessage={t("devices.noDevices")}
        keyExtractor={(device) => device.id}
        useUrlParams={true}
        defaultFilters={initialFilters}
        filterOptions={filterOptions}
        title={t("common.all", {
          name: t("nav.devices"),
        })}
        className={className}
        actionButton={
          <TableActions
            onRefresh={handleRefresh}
            onAdd={() => {
              setDeviceToEdit(null);
              setIsEditorOpen(true);
            }}
            addButtonText={t("devices.add")}
          />
        }
      />

      <DeviceEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setDeviceToEdit(null);
        }}
        deviceToEdit={deviceToEdit}
      />

      <LabelEditorModal
        isOpen={isLabelEditorOpen}
        onClose={() => {
          setIsLabelEditorOpen(false);
          setSelectedDeviceId(null);
        }}
        initialdevice_ids={selectedDeviceId ? [selectedDeviceId] : []}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        entityId={historyDeviceId}
        entityType="device"
        entityName={historyDeviceName}
      />
    </>
  );
};

export default DevicesTable;
