import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Device } from "@/types/device.types";
import { useToast } from "@/hooks/ux/useToast";
import { deviceService } from "@/services/device.service";

interface DeviceFormProps {
  device?: Device;
  isEditMode?: boolean;
  onClose: () => void;
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  device,
  isEditMode,
  onClose,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(device?.name || "");
  const [dev_eui, setDev_eui] = useState(device?.dev_eui || "");
  const [app_eui, setAppEui] = useState(device?.app_eui || "");
  const [app_key, setAppKey] = useState(device?.app_key || "");
  const [region, setRegion] = useState(device?.region || "");
  const [is_class_c, setIsClassC] = useState(device?.is_class_c || false);
  const [status, setStatus] = useState(device?.status || "offline");
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>(
    device?.label_ids || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure all required fields are properly formatted
      const formData = {
        name,
        dev_eui: dev_eui.toUpperCase(), // Ensure uppercase for hex values
        app_eui: app_eui.toUpperCase(), // Ensure uppercase for hex values
        app_key: app_key.toUpperCase(), // Ensure uppercase for hex values
        status: status as "online" | "offline",
        label_ids: selectedLabelIds,
        expected_transmit_time: device?.expected_transmit_time || 60, // Default to 60 minutes if not provided
        region: region as "EU868" | "US915" | "AU915" | "AS923", // Cast to specific region type
        is_class_c: is_class_c,
      };

      if (isEditMode && device) {
        await deviceService.updateDevice(device.id, formData);
        toast.success(t("devices.deviceUpdated"));
      } else {
        await deviceService.createDevice({
          ...formData,
          expected_transmit_time: 60, // Default to 60 minutes if not provided
        });
        toast.success(t("devices.deviceCreated"));
      }

      onClose();
    } catch (error) {
      console.error("Error saving device:", error);
      toast.error(
        isEditMode
          ? t("devices.failedToSaveDevice")
          : t("devices.errorCreating")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>{t("common.name")}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>{t("devices.enterDev_eui")}</label>
        <input
          type="text"
          value={dev_eui}
          onChange={(e) => setDev_eui(e.target.value)}
          required
        />
      </div>
      <div>
        <label>{t("devices.enterAppEui")}</label>
        <input
          type="text"
          value={app_eui}
          onChange={(e) => setAppEui(e.target.value)}
          required
        />
      </div>
      <div>
        <label>{t("devices.enterAppKey")}</label>
        <input
          type="text"
          value={app_key}
          onChange={(e) => setAppKey(e.target.value)}
          required
        />
      </div>
      <div>
        <label>{t("devices.region")}</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
        >
          <option value="">-- {t("common.select")} --</option>
          <option value="EU868">EU868</option>
          <option value="US915">US915</option>
          <option value="AU915">AU915</option>
          <option value="AS923">AS923</option>
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={is_class_c}
            onChange={(e) => setIsClassC(e.target.checked)}
          />
          {t("devices.isClassC")}
        </label>
      </div>
      <div>
        <label>{t("common.status")}</label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "online" | "offline" | "maintenance")
          }
          required
        >
          <option value="online">{t("common.online")}</option>
          <option value="offline">{t("common.offline")}</option>
          <option value="maintenance">{t("common.maintenance")}</option>
        </select>
      </div>
      <div>
        <label>{t("common.labels")}</label>
        <select
          multiple
          onChange={(e) =>
            setSelectedLabelIds(
              Array.from(e.target.selectedOptions, (option) =>
                Number(option.value)
              )
            )
          }
        >
          {/* Render label options dynamically */}
        </select>
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isEditMode ? t("common.save") : t("common.create")}
      </button>
      <button type="button" onClick={onClose}>
        {t("common.cancel")}
      </button>
    </form>
  );
};

export default DeviceForm;
