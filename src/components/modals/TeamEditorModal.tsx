import React from "react";
import { Team } from "@/types";
import Modal from "@/components/ui/Modal";
import { TextAreaField, FormFieldGrid } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { useTeamEditorModal } from "@/hooks/query/modals/useTeamEditorModal";
import ModalFooter from "./ModalFooter";

interface TeamEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  team?: Team;
}

const TeamEditorModal: React.FC<TeamEditorModalProps> = ({
  isOpen,
  onClose,
  team,
}) => {
  const { t } = useTranslation();

  // Use our custom TanStack Query hook
  const {
    name,
    setName,
    description,
    setDescription,
    error,
    isSubmitting,
    handleSubmit,
    isEditMode,
  } = useTeamEditorModal({
    team,
    onClose,
  });

  // Create a wrapper function that doesn't require parameters
  const handleSubmitWrapper = () => {
    // Create a synthetic event object to pass to handleSubmit
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;

    handleSubmit(syntheticEvent);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? t("teams.editTitle") : t("teams.createTitle")}
      footer={
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmitWrapper}
          isSubmitting={isSubmitting}
          submitText={
            isSubmitting
              ? t("teams.creating")
              : isEditMode
              ? t("common.update")
              : t("teams.createButton")
          }
        />
      }
      width="md"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="text-sm p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <FormFieldGrid label={t("common.name")} required>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("teams.namePlaceholder")}
              required
              autoFocus
              maxLength={100}
            />
          </FormFieldGrid>
        </div>

        <div className="space-y-2">
          <TextAreaField
            id="description"
            label={t("common.description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("teams.descriptionPlaceholder")}
            rows={3}
            maxLength={500}
          />
        </div>
      </form>
    </Modal>
  );
};

export default TeamEditorModal;
