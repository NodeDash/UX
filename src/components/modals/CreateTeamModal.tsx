import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { FormFieldGrid } from "../ui";
import ModalFooter from "./ModalFooter";
import { useCreateTeamModal } from "@/hooks/query/modals/useCreateTeamModal";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const { t } = useTranslation();

  // Use our custom hook for state and mutation logic
  const {
    teamName,
    setTeamName,
    description,
    setDescription,
    isSubmitting,
    error,
    handleSubmit,
  } = useCreateTeamModal({ onClose });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("teams.createTitle")}
      footer={
        <ModalFooter
          onCancel={onClose}
          formId="create-team-form"
          isSubmitting={isSubmitting}
          submitText={
            isSubmitting ? t("teams.creating") : t("teams.createButton")
          }
        />
      }
      width="md"
    >
      <form id="create-team-form" onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <FormFieldGrid label={t("common.name")} required>
            <Input
              id="name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder={t("teams.namePlaceholder")}
            />
          </FormFieldGrid>

          <FormFieldGrid label={t("common.description")}>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder={t("teams.descriptionPlaceholder")}
            />
          </FormFieldGrid>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
