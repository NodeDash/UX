import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "./index";
import { DeviceWithLabels } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ux/useToast";
import { useDeleteDevice } from "@/hooks/api/useDevices";

interface DeviceActionsProps {
  device: DeviceWithLabels;
  onEdit: () => void;
}

export const DeviceActions: React.FC<DeviceActionsProps> = ({
  device,
  onEdit,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const deleteMutation = useDeleteDevice({
    onSuccess: () => {
      toast.success(t("devices.deleteSuccess"));
      navigate("/devices");
    },
    onError: (error) => {
      console.error("Failed to delete device:", error);
      toast.error(t("devices.deleteError"));
    },
  });

  const handleDelete = () => {
    if (window.confirm(t("devices.confirmDelete"))) {
      deleteMutation.mutate(device.id);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <ActionButton onClick={onEdit}>{t("common.edit")}</ActionButton>
      <ActionButton onClick={handleDelete} variant="danger">
        {t("common.delete")}
      </ActionButton>
      <ActionButton onClick={() => navigate("/devices")}>
        {t("common.back")}
      </ActionButton>
    </div>
  );
};

export default DeviceActions;
