import React from "react";
import { useTranslation } from "react-i18next";
import { Device } from "@/types/device.types";
import Badge from "@/components/ui/Badge";
import { useLabels } from "@/hooks/api";
import StatusBadge from "./StatusBadge";

interface DeviceInfoPanelProps {
  device: Device;
  isDarkMode: boolean;
}

export const DeviceInfoPanel: React.FC<DeviceInfoPanelProps> = ({
  device,
  isDarkMode,
}) => {
  const { t } = useTranslation();
  const bgColor = isDarkMode ? "[#18181b]" : "gray-50";

  // Fetch labels to display with device
  const { data: allLabels = [] } = useLabels();

  // Filter labels based on device label_ids
  const deviceLabels = device.label_ids
    ? allLabels.filter((label) => device.label_ids.includes(Number(label.id)))
    : [];

  return (
    <div className={`bg-${bgColor} rounded-lg p-6 shadow-md`}>
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <h1 className="text-2xl font-bold">{device.name}</h1>
          <div className="text-gray-500">{device.id}</div>
        </div>
        <div className="mt-2 sm:mt-0">
          <StatusBadge status={device.status} type="device" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <h3 className="text-lg font-medium mb-2">{t("devices.details")}</h3>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <div className="text-gray-500">{t("devices.lastSeen")}:</div>
            <div>
              {device.lastSeen
                ? new Date(device.lastSeen).toLocaleString()
                : "-"}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">{t("devices.labels")}</h3>
          {deviceLabels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {deviceLabels.map((label) => (
                <Badge key={label.id} variant="outline">
                  {label.name}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 italic">{t("devices.noLabels")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoPanel;
