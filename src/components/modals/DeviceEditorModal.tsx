import React from "react";
import { Modal, FormField, SensitiveDataField } from "../ui";
import { useTranslation } from "react-i18next";
import { Device } from "../../types/device.types";
import LabelBadge from "../ui/LabelBadge";
import { useTheme } from "@/context/ThemeContext";
import { useDeviceEditorModal } from "@/hooks/query/modals/useDeviceEditorModal";
import ModalFooter from "./ModalFooter";

interface DeviceEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceToEdit?: Device | null;
}

const DeviceEditorModal: React.FC<DeviceEditorModalProps> = ({
  isOpen,
  onClose,
  deviceToEdit = null,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Use our custom TanStack Query hook
  const {
    name,
    setName,
    dev_eui,
    setDev_eui,
    app_eui,
    setAppEui,
    app_key,
    setAppKey,
    region,
    setRegion,
    is_class_c,
    setIsClassC,
    isAppKeyEditable,
    originalAppKey,
    expected_transmit_time,
    setExpectedTransmitTime,
    labels,
    selectedLabels,
    isSubmitting,
    isLoadingLabels,
    error,
    nameError,
    dev_euiError,
    app_euiError,
    app_keyError,
    transmitTimeOptions,
    toggleAppKeyEditable,
    toggleLabelSelection,
    handleSave,
    isEditMode,
  } = useDeviceEditorModal({
    deviceToEdit,
    onClose,
  });

  const inputBgColor = isDarkMode ? "bg-[#2c2c2c]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#3c3c3c]" : "border-gray-300";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? t("devices.editDevice") : t("devices.createDevice")}
      footer={
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSave}
          isSubmitting={isSubmitting}
          submitText={isEditMode ? t("common.update") : t("common.save")}
        />
      }
    >
      <div className="space-y-4">
        <FormField
          id="device-name"
          label="Device Name"
          placeholder={t("devices.enterDeviceName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          error={nameError || undefined}
        />

        <FormField
          id="device-deveui"
          label="DevEUI"
          placeholder="Enter 16 character hex DevEUI"
          value={dev_eui}
          onChange={(e) =>
            setDev_eui(e.target.value.replace(/[^0-9a-fA-F]/g, ""))
          }
          required
          className={`w-full px-4 py-2 ${inputBgColor} ${borderColor} border rounded-lg
          text-neutral-200 focus:outline-none focus:border-blue-500
          focus:ring-1 focus:ring-blue-500 transition-colors`}
          error={dev_euiError || undefined}
        />

        <FormField
          id="device-appeui"
          label="AppEUI"
          placeholder="Enter 16 character hex AppEUI"
          value={app_eui}
          onChange={(e) =>
            setAppEui(e.target.value.replace(/[^0-9a-fA-F]/g, ""))
          }
          required
          className={`w-full px-4 py-2 ${inputBgColor} ${borderColor} border rounded-lg
                      text-neutral-200 focus:outline-none focus:border-blue-500
                      focus:ring-1 focus:ring-blue-500 transition-colors`}
          error={app_euiError || undefined}
        />

        <SensitiveDataField
          id="device-appkey"
          label="AppKey"
          value={app_key}
          onChange={setAppKey}
          placeholder={
            isEditMode
              ? "Enter new 32 character hex AppKey"
              : "Enter 32 character hex AppKey"
          }
          required={!isEditMode}
          error={app_keyError || undefined}
          isEditable={isAppKeyEditable}
          isEditMode={isEditMode}
          toggleEditable={toggleAppKeyEditable}
          originalValue={originalAppKey}
          allowedCharacters={/[0-9a-fA-F]/}
          helpText={
            isEditMode
              ? isAppKeyEditable
                ? "Enter a new AppKey or leave blank to keep the existing one."
                : "AppKey is hidden for security. Click the edit button to change it."
              : undefined
          }
        />

        <div className="mb-4">
          <label
            htmlFor="device-region"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            {t("devices.region")} <span className="text-red-400">*</span>
          </label>
          <select
            id="device-region"
            value={region}
            onChange={(e) =>
              setRegion(e.target.value as "EU868" | "US915" | "AU915" | "AS923")
            }
            required
            className={`w-full px-4 py-2 ${inputBgColor} ${borderColor} border rounded-lg
                     text-neutral-200 focus:outline-none focus:border-blue-500
                     focus:ring-1 focus:ring-blue-500 transition-colors`}
          >
            <option value="EU868">EU868</option>
            <option value="US915">US915</option>
            <option value="AU915">AU915</option>
            <option value="AS923">AS923</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={is_class_c}
              onChange={(e) => setIsClassC(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
                        focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                        focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-neutral-300">
              {t("devices.isClassC")}
            </span>
          </label>
        </div>

        <div>
          <label
            htmlFor="expected-transmit-time"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Expected Transmission Time
          </label>
          <select
            id="expected-transmit-time"
            value={expected_transmit_time}
            onChange={(e) => setExpectedTransmitTime(Number(e.target.value))}
            className={`w-full px-4 py-2 ${inputBgColor} ${borderColor} border rounded-lg
                     text-neutral-200 focus:outline-none focus:border-blue-500
                     focus:ring-1 focus:ring-blue-500 transition-colors`}
          >
            {transmitTimeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Labels
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {isLoadingLabels ? (
              <div className="text-sm text-neutral-400">
                {t("labels.loadingLabels")}
              </div>
            ) : labels.length > 0 ? (
              labels.map((label) => (
                <div
                  key={label.id}
                  onClick={() => toggleLabelSelection(Number(label.id))}
                  className={`cursor-pointer transition-all ${
                    selectedLabels.includes(Number(label.id))
                      ? "ring-2 ring-blue-500 rounded-xl"
                      : "opacity-70 hover:opacity-100 rounded-xl"
                  }`}
                >
                  <LabelBadge label={label} />
                </div>
              ))
            ) : (
              <div className="text-sm text-neutral-400 italic">
                {t("labels.noLabelsAvailable")}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeviceEditorModal;
