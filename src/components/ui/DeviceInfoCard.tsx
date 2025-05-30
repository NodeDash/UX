import React from "react";
import { useTranslation } from "react-i18next";
import { StatusBadge, LabelBadge } from "./index";
import { DeviceWithLabels, Label } from "@/types";

interface DeviceInfoCardProps {
  device: DeviceWithLabels;
  lastSeenTimestamp: string | null;
  labels: Label[];
  isDarkMode: boolean;
}

export const DeviceInfoCard: React.FC<DeviceInfoCardProps> = ({
  device,
  lastSeenTimestamp,
  labels,
  isDarkMode,
}) => {
  const { t } = useTranslation();
  const bgColor = isDarkMode ? "[#18181b]" : "gray-50";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className={`bg-${bgColor} rounded-lg p-6 shadow-md`}>
        <div>
          <div className="space-y-3">
            <div>
              <span className="text-neutral-400">{t("common.name")}:</span>
              <span className="ml-2">{device.name}</span>
            </div>

            <div>
              <span className="text-neutral-400">{t("common.lastSeen")}:</span>
              <span className="ml-2">
                {lastSeenTimestamp
                  ? new Date(lastSeenTimestamp).toLocaleString()
                  : t("devices.neverSeen")}
              </span>
            </div>

            <div>
              <span className="text-neutral-400">{t("devices.dev_eui")}:</span>
              <span className="ml-2">{device.dev_eui}</span>
            </div>

            <div>
              <span className="text-neutral-400">
                {t("devices.expected_transmit_time")}:
              </span>
              <span className="ml-2">
                {device.expected_transmit_time >= 60
                  ? `${Math.floor(device.expected_transmit_time / 60)} ${
                      device.expected_transmit_time === 60 ? "hour" : "hours"
                    }${
                      device.expected_transmit_time % 60 > 0
                        ? ` ${device.expected_transmit_time % 60} minutes`
                        : ""
                    }`
                  : `${device.expected_transmit_time} minutes`}
              </span>
            </div>

            <div>
              <span className="text-neutral-400">{t("common.status")}:</span>
              <span className="ml-2">
                <StatusBadge status={device.status} type="device" />
              </span>
            </div>

            <div className="flex items-center">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-neutral-400">{t("common.labels")}:</span>

                {labels
                  .filter(
                    (label) =>
                      device.label_ids?.some(
                        (id) => String(id) === String(label.id)
                      ) ||
                      device.label_ids
                        ?.map((id) => String(id))
                        .includes(String(label.id))
                  )
                  .map((label) => (
                    <LabelBadge key={label.id} label={label} />
                  ))}
                {(!device.label_ids || device.label_ids.length === 0) && (
                  <span className="text-sm text-gray-400">
                    {t("labels.noLabelsForDevice")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`bg-${bgColor} rounded-lg p-6 shadow-md`}>
        <div className="space-y-3">
          <div>
            <span className="text-neutral-400">{t("devices.app_eui")}:</span>
            <span className="ml-2 font-mono text-sm">{device.app_eui}</span>
          </div>
          <div>
            <span className="text-neutral-400">{t("devices.region")}:</span>
            <span className="ml-2">{device.region}</span>
          </div>
          <div>
            <span className="text-neutral-400">{t("devices.class_c")}:</span>
            <span className="ml-2">
              {device.is_class_c ? t("common.enabled") : t("common.disabled")}
            </span>
          </div>
          <div>
            <span className="text-neutral-400">{t("devices.created")}:</span>
            <span className="ml-2">
              {new Date(device.created_at).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-neutral-400">{t("devices.updated")}:</span>
            <span className="ml-2">
              {new Date(device.updated_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoCard;
