import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  QueryClient
} from "@tanstack/react-query";
import { useTeamContext } from "@/context/TeamContext";
import { config } from "@/services/config.service";

// Data priority levels for different types of queries
export enum DataPriority {
  // Critical data that needs to be fresh (dashboard metrics, active flows)
  CRITICAL = 'critical',
  // Important data that should be updated regularly (device status, history)
  HIGH = 'high',
  // Standard data that can be updated less frequently (lists, configurations)
  MEDIUM = 'medium',
  // Reference data that rarely changes (team info, static configurations)
  LOW = 'low'
}

/**
 * Get standardized query options based on data priority
 * This provides consistent defaults across all queries while allowing
 * fine-tuning based on the importance of the data
 * 
 * @param priority - The priority level determining refresh rates and cache behavior
 * @param customOptions - Optional overrides for the standard query options
 * @returns UseQueryOptions object with appropriate settings for the priority level
 */
export function getQueryOptions<TData, TError = Error>(
  priority: DataPriority,
  customOptions?: Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'>
): Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'> {
  // Base options that apply to all priority levels
  const baseOptions: Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'> = {
    // These options will be merged with the defaults from QueryClient
    // and can be overridden by customOptions
  };

  // Priority-specific options
  const priorityOptions: Record<DataPriority, Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'>> = {
    [DataPriority.CRITICAL]: {
      // Critical data: keep very fresh, retry quickly
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
    [DataPriority.HIGH]: {
      // High priority: balance between freshness and performance
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    [DataPriority.MEDIUM]: {
      // Default/medium priority
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
    },
    [DataPriority.LOW]: {
      // Low priority: optimize for cache hits
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    }
  };

  // Merge options in order of precedence: baseOptions < priorityOptions < customOptions
  return {
    ...baseOptions,
    ...priorityOptions[priority],
    ...customOptions,
  };
}

/**
 * Helper to create consistent team-aware query keys
 * 
 * @param baseKey - The base key for the query
 * @param ids - Additional IDs to include in the query key
 * @returns Query key array with team context
 * @deprecated Use queryKeys object instead
 */
export const createQueryKey = (baseKey: string, ...ids: (string | undefined)[]) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  const cleanIds = ids.map(id => id || "all");
  return [baseKey, teamId ?? "user", ...cleanIds] as const;
};

/**
 * Helper for optimizing invalidation patterns
 * Prevents needless invalidations by checking if query exists in cache
 */
export const safeInvalidateQueries = (
  queryClient: QueryClient, 
  queryKey: readonly unknown[]
) => {
  // Only invalidate if the query exists in cache
  if (queryClient.getQueryCache().findAll({ queryKey: queryKey as unknown[] }).length > 0) {
    queryClient.invalidateQueries({ queryKey: queryKey as unknown[] });
  }
};

/**
 * Utility for creating team-context aware queries
 * 
 * @param baseKey - The base query key
 * @param queryFn - The function to fetch data, will be passed the team ID
 * @param options - Optional React Query configuration
 * @returns Query result with automatic team context handling
 */
export function useTeamQuery<TData>(
  baseKey: string,
  queryFn: (teamId?: number) => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error, TData, QueryKey>, "queryKey" | "queryFn">
) {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  
  return useQuery<TData, Error>({
    queryKey: [baseKey, teamId ?? "user"],
    queryFn: () => queryFn(teamId),
    refetchInterval: config.api.getDefaultRefreshRate(),
    ...options,
  });
}

/**
 * Utility for creating team-context aware detail queries for individual entities
 * 
 * @param baseKey - The base query key
 * @param id - The entity ID to fetch
 * @param queryFn - The function to fetch data, will be passed the entity ID and team ID
 * @param options - Optional React Query configuration
 * @returns Query result with automatic team context handling
 */
export function useTeamDetailQuery<TData>(
  baseKey: string,
  id: string,
  queryFn: (id: string, teamId?: number) => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error, TData, QueryKey>, "queryKey" | "queryFn">
) {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  
  return useQuery<TData, Error>({
    queryKey: [baseKey, teamId ?? "user", id],
    queryFn: () => queryFn(id, teamId),
    enabled: !!id,
    ...options,
  });
}

/**
 * Utility for creating team-context aware create mutations
 */
export function useTeamCreateMutation<TData, TCreate>(
  baseKey: string,
  mutationFn: (data: TCreate, teamId?: number) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TCreate>, "mutationFn" | "onSuccess">
) {
  const queryClient = useQueryClient();
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  
  return useMutation<TData, Error, TCreate>({
    mutationFn: (data) => mutationFn(data, teamId),
    onSuccess: () => {
      safeInvalidateQueries(queryClient, [baseKey, teamId ?? "user"]);
     
    },
    ...options,
  });
}

/**
 * Utility for creating team-context aware update mutations
 */
export function useTeamUpdateMutation<TData, TUpdate>(
  baseKey: string,
  mutationFn: (id: string, updates: TUpdate, teamId?: number) => Promise<TData>,
  getItemId: (data: TData) => string,
  options?: Omit<UseMutationOptions<TData, Error, { id: string; updates: TUpdate }>, "mutationFn" | "onSuccess">
) {
  const queryClient = useQueryClient();
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  
  return useMutation<TData, Error, { id: string; updates: TUpdate }>({
    mutationFn: ({ id, updates }) => mutationFn(id, updates, teamId),
    onSuccess: (data) => {
      const itemId = getItemId(data);
      safeInvalidateQueries(queryClient, [baseKey, teamId ?? "user"]);
      safeInvalidateQueries(queryClient, [baseKey, teamId ?? "user", itemId]);
    
    },
    ...options,
  });
}

/**
 * Utility for creating team-context aware delete mutations
 */
export function useTeamDeleteMutation<TData = void>(
  baseKey: string,
  mutationFn: (id: string, teamId?: number) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, string>, "mutationFn" | "onSuccess">
) {
  const queryClient = useQueryClient();
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  
  return useMutation<TData, Error, string>({
    mutationFn: (id) => mutationFn(id, teamId),
    onSuccess: (id) => {
      safeInvalidateQueries(queryClient, [baseKey, teamId ?? "user"]);
      queryClient.removeQueries({ queryKey: [baseKey, teamId ?? "user", id] });
      
     
    },
    ...options,
  });
}

/**
 * Enhanced queries using the queryKeys structure
 */

/**
 * Team-aware query using standardized queryKeys with data priority
 * 
 * @param keyFn - Function to generate the query key based on team ID
 * @param queryFn - Function to fetch data with team ID
 * @param priority - Data priority determining cache and refresh behavior
 * @param options - Optional React Query configuration options
 * @returns Query result with automatic team context handling and prioritized refresh strategy
 */
export function useStandardQuery<TData>(
  keyFn: (teamId?: number | string) => QueryKey,
  queryFn: (teamId?: number) => Promise<TData>,
  priority: DataPriority = DataPriority.MEDIUM,
  options?: Omit<UseQueryOptions<TData, Error, TData, QueryKey>, "queryKey" | "queryFn">
) {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  
  // Get the appropriate options based on data priority
  const priorityOptions = getQueryOptions<TData>(priority, options);
  
  return useQuery<TData, Error>({
    queryKey: keyFn(teamId),
    queryFn: () => queryFn(teamId),
    ...priorityOptions
  });
}

/**
 * Team-aware detail query using standardized queryKeys with data priority
 */
export function useStandardDetailQuery<TData>(
  keyFn: (id: string, teamId?: number | string) => QueryKey,
  id: string,
  queryFn: (id: string, teamId?: number) => Promise<TData>,
  priority: DataPriority = DataPriority.MEDIUM,
  options?: Omit<UseQueryOptions<TData, Error, TData, QueryKey>, "queryKey" | "queryFn">
) {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  
  // Get the appropriate options based on data priority
  const priorityOptions = getQueryOptions<TData>(priority, {
    enabled: !!id,
    ...options
  });
  
  return useQuery<TData, Error>({
    queryKey: keyFn(id, teamId),
    queryFn: () => queryFn(id, teamId),
    ...priorityOptions
  });
}

/**
 * Team-aware query using standardized queryKeys with history support and data priority
 */
export function useStandardHistoryQuery<TData>(
  keyFn: (id: string | undefined, teamId?: number | string) => QueryKey,
  id: string | undefined,
  queryFn: (id: string | undefined, teamId?: number) => Promise<TData>,
  priority: DataPriority = DataPriority.HIGH, // History data defaults to HIGH priority
  options?: Omit<UseQueryOptions<TData, Error, TData, QueryKey>, "queryKey" | "queryFn">
) {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  
  // Get the appropriate options based on data priority
  const priorityOptions = getQueryOptions<TData>(priority, options);
  
  return useQuery<TData, Error>({
    queryKey: keyFn(id, teamId),
    queryFn: () => queryFn(id, teamId),
    ...priorityOptions
  });
}

/**
 * Team-aware create mutation using standardized queryKeys
 */
export function useStandardCreateMutation<TData, TCreate>(
  entityKeys: { all: (teamId?: number | string) => QueryKey },
  mutationFn: (data: TCreate, teamId?: number) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TCreate>, "mutationFn" | "onSuccess">
) {
  const queryClient = useQueryClient();
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  
  return useMutation<TData, Error, TCreate>({
    mutationFn: (data) => mutationFn(data, teamId),
    onSuccess: () => {
      safeInvalidateQueries(queryClient, entityKeys.all(teamId));
      
      
    },
    ...options,
  });
}

/**
 * Team-aware update mutation using standardized queryKeys
 */
export function useStandardUpdateMutation<TData extends { id: string }, TUpdate>(
  entityKeys: { 
    all: (teamId?: number | string) => QueryKey,
    detail: (id: string, teamId?: number | string) => QueryKey,
    history?: (id: string) => QueryKey
  },
  mutationFn: (id: string, updates: TUpdate, teamId?: number) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, { id: string; updates: TUpdate }>, "mutationFn" | "onSuccess">
) {
  const queryClient = useQueryClient();
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  
  return useMutation<TData, Error, { id: string; updates: TUpdate }>({
    mutationFn: ({ id, updates }) => mutationFn(id, updates, teamId),
    onSuccess: (data) => {
      // Invalidate list queries
      safeInvalidateQueries(queryClient, entityKeys.all(teamId));
      
      // Invalidate detail query
      safeInvalidateQueries(queryClient, entityKeys.detail(data.id, teamId));
      
      // Invalidate history if applicable
      if (entityKeys.history) {
        safeInvalidateQueries(queryClient, entityKeys.history(data.id));
      }
      

    },
    ...options,
  });
}

/**
 * Team-aware delete mutation using standardized queryKeys
 */
export function useStandardDeleteMutation<TData = void>(
  entityKeys: { 
    all: (teamId?: number | string) => QueryKey,
    detail: (id: string, teamId?: number | string) => QueryKey,
    history?: (id: string) => QueryKey
  },
  mutationFn: (id: string, teamId?: number) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, string>, "mutationFn" | "onSuccess">
) {
  const queryClient = useQueryClient();
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === "team" ? selectedContext.team.id : undefined;
  
  return useMutation<TData, Error, string>({
    mutationFn: (id) => mutationFn(id, teamId),
    onSuccess: (_data, id) => {
      // Invalidate list queries
      safeInvalidateQueries(queryClient, entityKeys.all(teamId));
      
      // Remove detail query from cache
      queryClient.removeQueries({ queryKey: entityKeys.detail(id, teamId) as unknown[] });
      
      // Invalidate history if applicable
      if (entityKeys.history) {
        safeInvalidateQueries(queryClient, entityKeys.history(id));
      }
      

    },
    ...options,
  });
}