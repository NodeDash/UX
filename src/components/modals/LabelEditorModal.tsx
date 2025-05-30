import React, { useCallback, memo, useMemo } from "react";
import { Modal, FormField } from "../ui";
import { useTranslation } from "react-i18next";
import { useLabelEditorModal } from "@/hooks/query/modals/useLabelEditorModal";
import ModalFooter from "./ModalFooter";

interface LabelEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (name: string, device_ids: string[]) => Promise<void>;
  initialLabel?: { id: string; name: string; device_ids?: string[] } | null;
  initialdevice_ids?: string[];
}

const LabelEditorModal: React.FC<LabelEditorModalProps> = memo(
  ({
    isOpen,
    onClose,
    onSave,
    initialLabel = null,
    initialdevice_ids = [],
  }) => {
    const { t } = useTranslation();

    // Memoize the hook props to prevent infinite re-renders
    const hookProps = useMemo(
      () => ({
        initialLabel,
        initialdevice_ids,
        onSave,
      }),

      // eslint-disable-next-line react-hooks/exhaustive-deps
      [initialLabel?.id, onSave] // Only depend on initialLabel.id, not the entire object
    );

    // Use our custom TanStack Query hook with memoized props
    const {
      name,
      selecteddevice_ids,
      devices,
      isLoadingDevices,
      error,
      isSubmitting,
      handleDeviceToggle,
      handleNameChange,
      handleSave,
      handleClose,
      isEditMode,
    } = useLabelEditorModal(hookProps);

    // Memoize the submit handler to prevent recreating on every render
    const onSubmitForm = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
        onClose();
      },
      [handleSave, onClose]
    );

    // Create a wrapper for onClose that also calls handleClose
    const handleModalClose = useCallback(() => {
      handleClose();
      onClose();
    }, [onClose, handleClose]);

    // Don't render anything if modal is not open
    if (!isOpen) return null;

    return (
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={isEditMode ? t("labels.editLabel") : t("labels.createLabel")}
        footer={
          <ModalFooter
            onCancel={handleModalClose}
            formId="label-form"
            isSubmitting={isSubmitting}
            submitText={isEditMode ? t("common.save") : t("labels.createLabel")}
          />
        }
      >
        <form id="label-form" onSubmit={onSubmitForm} className="space-y-6">
          <FormField
            id="label-name"
            label={t("labels.labelName")}
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder={t("labels.enterLabelName")}
            autoFocus
            error={error || undefined}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("common.devices")}
            </label>

            {isLoadingDevices ? (
              <div className="p-4 text-center">
                <span className="text-sm text-gray-400">
                  {t("devices.loadingDevices")}
                </span>
              </div>
            ) : devices.length > 0 ? (
              <div className="max-h-60 overflow-y-auto border border-gray-700 rounded-md p-2">
                {devices.map((device) => {
                  const deviceId = String(device.id);
                  const isSelected = selecteddevice_ids.includes(deviceId);

                  return (
                    <div
                      key={deviceId}
                      className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-800 ${
                        isSelected ? "bg-gray-800" : ""
                      }`}
                      onClick={() => handleDeviceToggle(deviceId)}
                    >
                      <input
                        type="checkbox"
                        id={`device-${deviceId}`}
                        checked={isSelected}
                        onChange={() => handleDeviceToggle(deviceId)} // Add proper onChange handler
                        className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`device-${deviceId}`}
                        className="ml-3 block text-sm cursor-pointer flex-grow"
                      >
                        <span className="font-medium">{device.name}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          ({device.dev_eui || deviceId})
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center">
                <span className="text-sm text-gray-400">
                  {t("devices.noDevices")}
                </span>
              </div>
            )}

            <div
              className="mt-2 text-sm text-gray-400"
              data-testid="device-count"
            >
              {selecteddevice_ids.length > 0
                ? t("labels.devicesSelected", {
                    count: selecteddevice_ids.length,
                  })
                : t("labels.noDevicesSelected")}
            </div>
          </div>
        </form>
      </Modal>
    );
  }
);

export default LabelEditorModal;
