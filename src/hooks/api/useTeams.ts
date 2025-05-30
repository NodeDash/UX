import {
  UseQueryOptions,
  UseMutationOptions,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { teamService } from '@/services/team.service';
import { Team } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query/queryKeys';
import {
  useStandardCreateMutation,
  useStandardUpdateMutation,
  useStandardDeleteMutation,
  DataPriority,
  getQueryOptions
} from '../query/queryUtils';

/**
 * Hook to fetch all teams
 */
export const useTeams = (options?: UseQueryOptions<Team[]>) => {
  // Teams are not team-context aware (they're global to the user)
  // Teams data changes very infrequently - use LOW priority
  const priorityOptions = getQueryOptions<Team[]>(DataPriority.LOW, options);
  
  return useQuery<Team[], Error>({
    queryKey: queryKeys.teams.all(),
    queryFn: teamService.getTeams,
    ...priorityOptions
  });
};

/**
 * Hook to fetch a single team by ID
 */
export const useTeam = (id: number, options?: UseQueryOptions<Team>) => {
  // Team detail is also relatively static - use LOW priority
  const priorityOptions = getQueryOptions<Team>(DataPriority.LOW, {
    enabled: !!id,
    ...options
  });
  
  return useQuery<Team, Error>({
    queryKey: queryKeys.teams.detail(id),
    queryFn: () => teamService.getTeamById(id),
    ...priorityOptions
  });
};

/**
 * Hook to create a new team
 */
export const useCreateTeam = (
  options?: UseMutationOptions<Team, Error, Partial<Team>>
) => {
  return useStandardCreateMutation<Team, Partial<Team>>(
    queryKeys.teams,
    (data) => teamService.createTeam({
      name: data.name!,
      description: data.description
    }),
    options
  );
};

/**
 * Hook to update an existing team
 */
export const useUpdateTeam = (
  options?: UseMutationOptions<Team, Error, { id: string | number; updates: Partial<Team> }>
) => {
  return useStandardUpdateMutation<Team, Partial<Team>>(
    queryKeys.teams,
    (id, data) => {
      // Convert id to number if it's a string
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      return teamService.updateTeam(numericId, data);
    },
    options
  );
};

/**
 * Hook to delete a team
 */
export const useDeleteTeam = (
  options?: UseMutationOptions<void, Error, string | number>
) => {
  return useStandardDeleteMutation<void>(
    queryKeys.teams,
    (id) => {
      // Convert id to number if it's a string
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      return teamService.deleteTeam(numericId);
    },
    options
  );
};

/**
 * Hook to add a member to a team
 */
export const useAddTeamMember = (
  options?: Omit<UseMutationOptions<void, Error, { teamId: number; email: string }>, "mutationFn" | "onSuccess">
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, email }: { teamId: number; email: string }) =>
      teamService.addTeamMember(teamId, email),
    onSuccess: (_data, { teamId }) => {
      // Invalidate the team detail query to refresh the team data
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.teams.detail(teamId) 
      });
    },
    ...options
  });
};

/**
 * Hook to remove a member from a team
 */
export const useRemoveTeamMember = (
  options?: Omit<UseMutationOptions<void, Error, { teamId: number; userId: number }>, "mutationFn" | "onSuccess">
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
      teamService.removeTeamMember(teamId, userId),
    onSuccess: (_data, { teamId }) => {
      // Invalidate the team detail query to refresh the team data
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.teams.detail(teamId) 
      });
    },
    ...options
  });
};