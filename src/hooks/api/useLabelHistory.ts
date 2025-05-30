import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { labelService } from '@/services/label.service';
import { config } from '@/services/config.service';
import { useTeamContext } from '@/context/TeamContext';
import { queryKeys } from '../query/queryKeys';

/**
 * Hook to fetch label history data
 * 
 * @param labelId Optional label ID to filter by specific label
 * @param flowId Optional flow ID to filter history
 * @param options React Query options
 * @returns Query result containing label history data
 */
export const useLabelHistory = (
  labelId?: string,
  flowId?: string,
  options?: UseQueryOptions<any[]>
) => {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  
  // Check if labelId is a valid non-empty string
  const hasValidLabelId = !!labelId && labelId.trim().length > 0;
  
  // Use standardized query keys from our central queryKeys object
  const queryKey = hasValidLabelId 
    ? queryKeys.labels.history(labelId as string, flowId, teamId)
    : ['label-history-all', teamId ?? 'user', flowId || 'all'];
  
  return useQuery<any[]>({
    queryKey,
    queryFn: async () => {
      try {
        // If we have a valid labelId, get history for that specific label
        if (hasValidLabelId) {
          const response = await labelService.getLabelHistory(labelId as string, teamId);

          
          // If flowId is provided, filter the results client-side
          if (flowId && Array.isArray(response)) {
            return response.filter(item => parseInt(item.flow_id) === parseInt(flowId));

          }
          
          return response;
        } else {
          // Get all label history
          const response = await labelService.getAllLabelHistory(teamId);

          // If we have a flowId, filter the results client-side
          if (flowId && Array.isArray(response)) {
            return response.filter(item => parseInt(item.flow_id) === parseInt(flowId));
          }
          return response;
        }
      } catch (error) {
        console.error('Error fetching label history:', error);
        return [];
      }
    },
    refetchInterval: config.api.getDefaultRefreshRate(),
    ...options,
  });
};