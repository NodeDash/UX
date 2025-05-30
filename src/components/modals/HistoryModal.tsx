import React from "react";
import { Modal } from "../ui";
import { useTranslation } from "react-i18next";
import DeviceHistoryTable from "@/components/tables/DeviceHistoryTable";
import FlowHistoryTable from "@/components/tables/FlowHistoryTable";
import FunctionHistoryTable from "@/components/tables/FunctionHistoryTable";
import IntegrationHistoryTable from "@/components/tables/IntegrationHistoryTable";
import LabelHistoryTable from "@/components/tables/LabelHistoryTable";
import ModalFooter from "./ModalFooter";
import { useHistoryModal } from "@/hooks/query/modals/useHistoryModal";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId?: string;
  entityType?: "function" | "integration" | "flow" | "label" | "device";
  entityName?: string;
  // Legacy prop names for backwards compatibility
  functionId?: string;
  functionName?: string;
  integrationId?: string;
  integrationName?: string;
  flowId?: string;
  flowName?: string;
  labelId?: string;
  labelName?: string;
  deviceId?: string;
  deviceName?: string;
  refreshInterval?: number; // Time in ms between refreshes - now handled by React Query
}

const HistoryModal: React.FC<HistoryModalProps> = (props) => {
  const { isOpen, onClose } = props;
  const { t } = useTranslation();

  // Use our custom hook to handle the entity resolution logic
  const { resolvedEntityId, resolvedEntityType, title } =
    useHistoryModal(props);

  // Render the appropriate history table based on entity type
  const renderHistoryTable = () => {
    switch (resolvedEntityType) {
      case "function":
        return <FunctionHistoryTable functionId={resolvedEntityId} />;
      case "integration":
        return <IntegrationHistoryTable integrationId={resolvedEntityId} />;
      case "flow":
        return <FlowHistoryTable flowId={resolvedEntityId} />;
      case "device":
        return <DeviceHistoryTable deviceId={resolvedEntityId} />;
      case "label":
        return <LabelHistoryTable labelId={resolvedEntityId} />;
      default:
        return (
          <div className="text-sm text-gray-400">
            {t("history.unsupportedEntityType")}
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="xl"
      footer={<ModalFooter onCancel={onClose} cancelText={t("common.close")} />}
    >
      {renderHistoryTable()}
    </Modal>
  );
};

export default HistoryModal;
