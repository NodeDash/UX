import React from "react";
import { Modal, FormField, TextAreaField } from "../ui";
import { useTranslation } from "react-i18next";
import { Flow } from "../../types/flow.types";
import ModalFooter from "./ModalFooter";
import { useFlowEditorModal } from "@/hooks/query/modals/useFlowEditorModal";

interface FlowEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  flow?: Flow; // Optional flow for editing
}

const FlowEditorModal: React.FC<FlowEditorModalProps> = ({
  isOpen,
  onClose,
  flow,
}) => {
  const { t } = useTranslation();

  // Use our custom hook for all state and logic
  const {
    name,
    setName,
    description,
    setDescription,
    isSaving,
    error,
    nameError,
    handleSave,
    isEditMode,
  } = useFlowEditorModal({ flow, onClose });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? t("flows.editFlow") : t("flows.createFlow")}
      footer={
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          submitText={t("flows.saveFlow")}
        />
      }
    >
      <div className="space-y-4">
        <FormField
          id="flow-name"
          label={t("flows.flowName")}
          placeholder={t("flows.enterFlowName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          error={nameError || undefined}
        />

        <TextAreaField
          id="flow-description"
          label={t("common.description")}
          placeholder={t("flows.flowDescription")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FlowEditorModal;
