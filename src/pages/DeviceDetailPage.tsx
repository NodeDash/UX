import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import DeviceHistoryTable from "../components/tables/DeviceHistoryTable";
import DeviceEditorModal from "../components/modals/DeviceEditorModal";
import {
  PageContainer,
  ErrorMessage,
  StatusBadge,
  LoadingSpinner,
  LabelBadge,
  ActionButton,
  DocumentTitle,
} from "../components/ui";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useDeviceHistory, useDevice, useLabels } from "@/hooks/api";

const DeviceDetailPage: React.FC = () => {
  const { deviceId = "" } = useParams<{ deviceId: string }>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { t } = useTranslation();

  const theme = useTheme();
  const isDarkMode = theme.theme === "dark";
  const bgColorClass = isDarkMode ? "bg-[#18181b]" : "bg-gray-50";

  const {
    data: device,
    isLoading: isDeviceLoading,
    error: deviceError,
  } = useDevice(deviceId);

  const { data: allLabels = [], isLoading: isLabelsLoading } = useLabels();

  // Fetch device history to get the last seen timestamp
  const { data: deviceHistory = [] } = useDeviceHistory(deviceId);

  // Get the most recent history entry (if any)
  const lastSeenTimestamp = React.useMemo(() => {
    return (
      (deviceHistory as Array<{ event: string; timestamp: string }>)
        .filter((entry) => entry.event === "uplink")
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0]?.timestamp || null
    );
  }, [deviceHistory]);

  const handleOpenEdit = () => {
    setIsEditorOpen(true);
  };

  const isLoading = isDeviceLoading || isLabelsLoading;
  const error = deviceError?.message;

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t("devices.title")}</h1>
        </div>
        <LoadingSpinner message={t("devices.loadingDevice")} fullPage />
      </PageContainer>
    );
  }

  if (error || !device) {
    return (
      <PageContainer>
        <ErrorMessage message={error || t("devices.deviceNotFound")} />
        <div className="mt-4">
          <Link
            to="/devices"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            &larr; {t("common.backToDevices")}
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <DocumentTitle title={device.name} />
      <div className="flex items-center justify-between mb-6">
        <ActionButton onClick={() => window.history.back()} variant="primary">
          {t("common.backToDevices")}
        </ActionButton>
        <ActionButton onClick={handleOpenEdit} variant="primary">
          {t("common.edit")}
        </ActionButton>
      </div>

      <h2 className="text-xl font-semibold mb-6">{t("common.deviceInfo")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${bgColorClass} rounded-lg p-6 shadow-md`}>
          <div>
            <div className="space-y-3">
              <div>
                <span className="text-neutral-400">{t("common.name")}:</span>
                <span className="ml-2">{device.name}</span>
              </div>

              <div>
                <span className="text-neutral-400">
                  {t("common.lastSeen")}:
                </span>
                <span className="ml-2">
                  {lastSeenTimestamp
                    ? new Date(lastSeenTimestamp).toLocaleString()
                    : t("devices.neverSeen")}
                </span>
              </div>

              <div>
                <span className="text-neutral-400">
                  {t("devices.dev_eui")}:
                </span>
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
                  <span className="text-neutral-400">
                    {t("common.labels")}:
                  </span>

                  {allLabels
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
        <div className={`${bgColorClass} rounded-lg p-6 shadow-md`}></div>
      </div>

      {/* Device History Table with Refresh Controls */}
      <DeviceHistoryTable deviceId={device.id} className="mt-8" />

      {/* Device Editor Modal */}
      <DeviceEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        deviceToEdit={device}
      />
    </PageContainer>
  );
};

export default DeviceDetailPage;
