import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { FunctionHistory } from '@/types';
import { config } from '@/services/config.service';
import { useTeamContext } from '@/context/TeamContext';
import { getAllFunctionHistory, getFunctionHistory } from '@/services/function-history.service';
import { queryKeys } from '../query/queryKeys';

/**
 * Hook to fetch history for a specific function or all functions
 * @param functionId Function ID to filter history (optional - if empty, will return history for all functions)
 * @param flowId Flow ID to filter history (optional - specific use case)
 * @param options React Query options
 */
export const useFunctionHistory = (
  functionId?: string,
  flowId?: string,
  options?: UseQueryOptions<FunctionHistory[]>
) => {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;

  // Use standardized query keys
  const queryKey = functionId 
    ? queryKeys.functions.history(functionId)
    : flowId
      ? ['function-history-by-flow', flowId, teamId ?? 'user']
      : ['function-history-all', teamId ?? 'user'];

  return useQuery<FunctionHistory[]>({
    queryKey,
    queryFn: () => {
      if (functionId) {
        return getFunctionHistory(functionId, teamId);
      } else {
        return getAllFunctionHistory(teamId);
      }
    },
    refetchInterval: config.api.getDefaultRefreshRate(),
    ...options
  });
};