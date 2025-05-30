import { useTranslation } from 'react-i18next';
import { Team } from '@/types';
import { 
  useTeams, 
  useDeleteTeam, 
  useUpdateTeam, 
  useCreateTeam 
} from '@/hooks/api';
import { useTableData } from './useTableData';

/**
 * Custom hook to provide all team table operations in a single place
 * This encapsulates the team-related data fetching and mutations
 */
export function useTeamsTable() {
  const { t } = useTranslation();

  // Get query and mutation hooks
  const teamsQuery = useTeams();
  const deleteTeamMutation = useDeleteTeam();
  const updateTeamMutation = useUpdateTeam();
  const createTeamMutation = useCreateTeam();

  // Use the standardized table data hook with our team-specific operations
  return useTableData<Team, any, any>({
    queryResult: teamsQuery,
    mutations: {
      delete: deleteTeamMutation.mutateAsync,
      update: (id, updates) => updateTeamMutation.mutateAsync({ id, updates }),
      create: createTeamMutation.mutateAsync,
    },
    messages: {
      entityName: "team",
      deleted: t("teams.teamDeleted"),
      created: t("teams.teamCreated"),
      updated: t("teams.teamUpdated"),
      failedToDelete: t("teams.errorDeleting"),
      failedToCreate: t("teams.errorCreating"),
      failedToUpdate: t("teams.errorUpdating"),
      confirmDelete: t("teams.confirmDeleteTeam"),
    },
  });
}