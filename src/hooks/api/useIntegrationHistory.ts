import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { integrationService } from '@/services/integration.service';
import { config } from '@/services/config.service';
import { useTeamContext } from '@/context/TeamContext';
import { IntegrationHistory } from '@/types';
import { queryKeys } from '../query/queryKeys';

/**
 * Hook to fetch integration history data
 * 
 * @param integrationId Optional integration ID to filter by specific integration
 * @param flowId Optional flow ID to filter history
 * @param options React Query options
 * @returns Query result containing integration history data
 */
export const useIntegrationHistory = (
  integrationId?: string,
  flowId?: string,
  options?: UseQueryOptions<IntegrationHistory[]>
) => {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  
  // Use standardized query keys from our central queryKeys object
  const queryKey = integrationId 
    ? queryKeys.integrations.history(integrationId, flowId, teamId)
    : ['integration-history-all', teamId ?? 'user', flowId || 'all'];
  
  return useQuery<IntegrationHistory[]>({
    queryKey,
    queryFn: async () => {
      try {
        // If integrationId is provided, get history for that integration
        // Otherwise get all integration history from the all-history endpoint
        if (integrationId) {
          return integrationService.getIntegrationHistory(integrationId, teamId);
        } else {
          const response = await integrationService.getAllIntegrationHistory(teamId);
          //if we have a flowId, filter the results client-side
          if (flowId && Array.isArray(response)) {
            return response.filter(item => String(item.flowId) === flowId);
          }

          return response;
        }
      } catch (error) {
        console.error('Error fetching integration history:', error);
        return [];
      }
    },
    enabled: true,
    refetchInterval: config.api.getDefaultRefreshRate(),
    ...options,
  });
};