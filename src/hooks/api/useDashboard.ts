import { 
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/services/api-endpoints';
import { useTeamContext } from '@/context/TeamContext';
import { queryKeys } from '../query/queryKeys';
import { DataPriority, getQueryOptions } from '../query/queryUtils';

/**
 * Interface for dashboard statistics
 */
interface DashboardStats {
  deviceStats: {
    total: number;
    online: number;
    offline: number;
    neverSeen: number;
    maintenance: number;
  };
  flowStats: {
    total: number;
    success: number;
    error: number;
    partialSuccess: number;
    pending: number;
    inactive: number;
  };
  functionStats: {
    total: number;
    active: number;
    error: number;
    inactive: number;
  };
  integrationStats: {
    total: number;
    active: number;
    inactive: number;
    error: number;
  };
}

/**
 * Service function to fetch dashboard statistics
 * 
 * @param teamId - Optional team ID to filter data by team
 * @returns Promise containing dashboard statistics
 */
export const getDashboardStats = async (teamId?: number): Promise<DashboardStats> => {
  const params = teamId ? { team_id: teamId } : undefined;
  return apiClient.get<DashboardStats>(API_ENDPOINTS.dashboard.stats, { params });
};

/**
 * Hook to fetch dashboard data with real-time system statistics
 * 
 * @param options - Optional React Query configuration options
 * @returns Query result containing dashboard statistics, loading state, and error state
 */
export const useDashboard = (options?: UseQueryOptions<DashboardStats>) => {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;

  // Dashboard statistics are CRITICAL priority because they show real-time system status
  const priorityOptions = getQueryOptions<DashboardStats>(DataPriority.CRITICAL, options);

  return useQuery<DashboardStats>({
    queryKey: queryKeys.dashboard.stats(teamId),
    queryFn: () => getDashboardStats(teamId),
    ...priorityOptions
  });
};