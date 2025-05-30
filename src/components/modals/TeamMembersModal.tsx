import React from "react";
import { TeamWithUsers } from "@/types";
import Modal from "@/components/ui/Modal";
import { Button, FormFieldGrid } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import ModalFooter from "./ModalFooter";
import { useTeamMembersModal } from "@/hooks/query/modals/useTeamMembersModal";

interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamWithUsers;
  onAddMember: (email: string) => Promise<void>;
  onRemoveMember: (userId: number) => Promise<void>;
}

const TeamMembersModal: React.FC<TeamMembersModalProps> = ({
  isOpen,
  onClose,
  team,
  onAddMember,
  onRemoveMember,
}) => {
  const { t } = useTranslation();

  // Use our custom hook for all state and logic
  const {
    email,
    setEmail,
    error,
    isSubmitting,
    isRemoving,
    handleAddMember,
    handleRemoveMember,
  } = useTeamMembersModal({
    team,
    onAddMember,
    onRemoveMember,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("teams.membersTitle", { name: team.name })}
      footer={<ModalFooter onCancel={onClose} cancelText={t("common.close")} />}
      width="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="text-sm p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-grow">
              <FormFieldGrid label={t("teams.memberEmail")} required>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("teams.memberEmailPlaceholder")}
                  required
                />
              </FormFieldGrid>
            </div>
            <Button type="submit" disabled={isSubmitting} className="self-end">
              {isSubmitting ? t("common.saving") : t("teams.addMember")}
            </Button>
          </div>
        </form>

        <div className="border-t border-gray-700 pt-4">
          <h3 className="font-medium text-lg mb-2">
            {t("teams.currentMembers")}
          </h3>

          {team.users.length === 0 ? (
            <p className="text-sm text-gray-400">{t("teams.noMembers")}</p>
          ) : (
            <ul className="space-y-2">
              {team.users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between border border-gray-700 rounded-md p-2"
                >
                  <span className="text-sm">{user.email}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveMember(user.id)}
                    disabled={isSubmitting || isRemoving === user.id}
                  >
                    {isRemoving === user.id
                      ? t("common.removing")
                      : t("common.remove")}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TeamMembersModal;
