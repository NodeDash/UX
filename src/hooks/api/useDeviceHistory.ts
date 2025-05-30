import { UseQueryOptions } from '@tanstack/react-query';
import { DeviceHistory } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useTeamContext } from '@/context/TeamContext';
import { getAllDeviceHistory, getDeviceHistory } from '@/services/device-history.service';
import { queryKeys } from '../query/queryKeys';
import { DataPriority, getQueryOptions } from '../query/queryUtils';

/**
 * Hook to fetch history for a specific device or flow
 * @param deviceId Device ID to filter history (optional - if empty, will return history for all devices)
 * @param flowId Flow ID to filter history (optional - specific use case)
 * @param options React Query options
 */
export const useDeviceHistory = (
  deviceId?: string,
  flowId?: string,
  options?: UseQueryOptions<DeviceHistory[]>
) => {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  
  // Use the standardized queryKeys structure
  const queryKey = deviceId 
    ? queryKeys.devices.history(deviceId)
    : flowId 
      ? ['device-history-by-flow', flowId]
      : ['device-history-all', teamId ?? 'user'];

  // Device history is HIGH priority data - especially for specific devices
  const priority = DataPriority.CRITICAL;
  const priorityOptions = getQueryOptions<DeviceHistory[]>(priority, {
    // Default to not refetching on window focus since our smart refetch will handle that
    refetchOnWindowFocus: false,
    ...options
  });
      
  const query = useQuery<DeviceHistory[]>({
    queryKey,
    queryFn: () => {
      if (deviceId) {
        return getDeviceHistory(deviceId, teamId);
      } else {
        return getAllDeviceHistory(teamId);
      }
    },
    ...priorityOptions
  });

  return query;
};

/**
 * Helper to get the query key for device history in the current team context
 * @deprecated Use queryKeys.devices.history() directly
 */
export const getDeviceHistoryQueryKey = (deviceId?: string, flowId?: string) => {
  if (deviceId) {
    return queryKeys.devices.history(deviceId);
  } else if (flowId) {
    return ['device-history-by-flow', flowId];
  }
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  return ['device-history-all', teamId ?? 'user'];
};