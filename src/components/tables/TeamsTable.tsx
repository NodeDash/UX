import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Team, TeamWithUsers } from "../../types/team.types";
import { teamService } from "@/services/team.service";
import { useToast } from "@/hooks/ux/useToast";
import { ErrorMessage, Table, TableActions, LoadingSpinner } from "../ui";
import TeamEditorModal from "@/components/modals/TeamEditorModal";
import TeamMembersModal from "@/components/modals/TeamMembersModal";
import TableColumnActions from "@/components/tables/TableColumnActions";
import { useTeamsTable } from "@/hooks/query/tables/useTeamsTable";
import { useAddTeamMember, useRemoveTeamMember } from "@/hooks/api/useTeams";

interface TeamsTableProps {
  className?: string;
}

export const TeamsTable: React.FC<TeamsTableProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  const toast = useToast();

  // Team members modal state
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [currentTeamWithUsers, setCurrentTeamWithUsers] =
    useState<TeamWithUsers | null>(null);

  // Use our custom hook that encapsulates all team-related data operations
  const {
    data: teams,
    isLoading,
    error,
    selectedItem: selectedTeam,
    isEditorOpen,
    handleRefresh,
    openEditor,
    closeEditor,
  } = useTeamsTable();

  // Use our extracted mutation hooks instead of defining them inline
  const addTeamMemberMutation = useAddTeamMember({
    onError: (err) => {
      toast.error(t("teams.failedToAddMember"));
      console.error(t("teams.errorAddingMember"), err);
    },
  });

  // Use our extracted mutation hook for removing members
  const removeTeamMemberMutation = useRemoveTeamMember({
    onError: (err) => {
      toast.error(t("teams.failedToRemoveMember"));
      console.error(t("teams.errorRemovingMember"), err);
    },
  });

  // Handle view members
  const handleViewMembers = async (team: Team) => {
    try {
      const teamWithUsers = await teamService.getTeamById(Number(team.id));
      setCurrentTeamWithUsers(teamWithUsers);
      setIsMembersModalOpen(true);
    } catch (err) {
      toast.error(t("teams.failedToLoadMembers"));
      console.error(t("teams.errorLoadingMembers"), err);
    }
  };

  const handleAddMember = (teamId: number, email: string): Promise<void> => {
    return addTeamMemberMutation.mutateAsync({ teamId, email });
  };

  const handleRemoveMember = (
    teamId: number,
    userId: number
  ): Promise<void> => {
    if (!window.confirm(t("teams.confirmRemoveMember"))) {
      return Promise.resolve();
    }
    return removeTeamMemberMutation.mutateAsync({ teamId, userId });
  };

  const columns = [
    {
      key: "name",
      header: t("common.name"),
      render: (team: Team) => (
        <>
          <div className="text-lg font-medium">{team.name}</div>
          <span className="text-sm">{team.description || ""}</span>
        </>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (team: Team) => (
        <TableColumnActions
          entityId={String(team.id)}
          entityType="team"
          entityName={team.name}
          onEdit={() => openEditor(team)}
          showHistory={false}
          customActions={
            <button
              onClick={() => handleViewMembers(team)}
              className="p-1.5 px-2 text-xs bg-blue-600 text-white rounded
                     hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              {t("teams.members")}
            </button>
          }
        />
      ),
    },
  ];

  if (isLoading && teams?.length === 0) {
    return <LoadingSpinner message={t("teams.loadingTeams")} fullPage />;
  }

  return (
    <>
      {error && <ErrorMessage message={t("teams.failedToLoadTeams")} />}

      <Table
        columns={columns}
        data={teams || []}
        isLoading={isLoading}
        emptyMessage={t("teams.noTeams")}
        keyExtractor={(team: Team) => String(team.id)}
        title={t("teams.title")}
        className={className}
        actionButton={
          <TableActions
            onRefresh={handleRefresh}
            onAdd={() => openEditor()}
            addButtonText={t("teams.add")}
          />
        }
      />

      {isEditorOpen && (
        <TeamEditorModal
          isOpen={isEditorOpen}
          onClose={closeEditor}
          team={selectedTeam || undefined}
        />
      )}

      {isMembersModalOpen && currentTeamWithUsers && (
        <TeamMembersModal
          isOpen={isMembersModalOpen}
          onClose={() => setIsMembersModalOpen(false)}
          team={currentTeamWithUsers}
          onAddMember={(email) =>
            handleAddMember(currentTeamWithUsers.id, email)
          }
          onRemoveMember={(userId) =>
            handleRemoveMember(currentTeamWithUsers.id, userId)
          }
        />
      )}
    </>
  );
};

export default TeamsTable;
