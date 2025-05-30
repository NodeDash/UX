import {
  UseQueryOptions,
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { providerService } from '@/services/provider.service';
import { 
  Provider, 
  CreateProviderDto, 
  UpdateProviderDto, 
} from '@/types/provider.types';
import { useTeamContext } from '@/context/TeamContext';
import { queryKeys } from '../query/queryKeys';
import { DataPriority, getQueryOptions } from '../query/queryUtils';

/**
 * Hook to fetch all providers
 */
export const useProviders = (options?: UseQueryOptions<Provider[]>) => {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  
  // Get options with appropriate data priority for provider lists
  // Provider list is configuration data that changes infrequently
  const priorityOptions = getQueryOptions<Provider[]>(DataPriority.LOW, options);
  
  return useQuery<Provider[]>({
    queryKey: queryKeys.providers.all(teamId),
    queryFn: () => providerService.getAll(teamId),
    ...priorityOptions
  });
};

/**
 * Hook to fetch a single provider by ID
 */
export const useProvider = (id: string, options?: UseQueryOptions<Provider>) => {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  
  // Get options with appropriate data priority for provider details
  // Provider details are important when configuring integrations
  const priorityOptions = getQueryOptions<Provider>(DataPriority.MEDIUM, {
    enabled: !!id,
    ...options
  });
  
  return useQuery<Provider>({
    queryKey: queryKeys.providers.detail(id, teamId),
    queryFn: () => providerService.getById(id, teamId),
    ...priorityOptions
  });
};

/**
 * Hook to create a new provider
 */
export const useCreateProvider = (
  options?: UseMutationOptions<Provider, Error, CreateProviderDto>
) => {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  const queryClient = useQueryClient();
  
  return useMutation<Provider, Error, CreateProviderDto>({
    mutationFn: (data) => providerService.create(data, teamId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all(teamId) });
      
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options
  });
};

/**
 * Hook to update an existing provider
 */
export const useUpdateProvider = (
  options?: UseMutationOptions<Provider, Error, { id: string; updates: UpdateProviderDto }>
) => {
  const queryClient = useQueryClient();
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  
  return useMutation<Provider, Error, { id: string; updates: UpdateProviderDto }>({
    mutationFn: ({ id, updates }) => providerService.update(id, updates, teamId),
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all(teamId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.detail(variables.id, teamId) });


      
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options
  });
};

/**
 * Hook to delete a provider
 */
export const useDeleteProvider = (
  options?: UseMutationOptions<null, Error, string>
) => {
  const queryClient = useQueryClient();
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  
  return useMutation<null, Error, string>({
    mutationFn: (id) => providerService.delete(id, teamId),
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all(teamId) });
      queryClient.removeQueries({ queryKey: queryKeys.providers.detail(variables, teamId) });
      
      // Also invalidate related entities that might be affected by provider deletion
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.flows.all() });
      
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options
  });
};

/**
 * Hook to toggle a provider's active status - specialized operation
 */
export const useToggleProviderActive = (
  options?: UseMutationOptions<Provider, Error, { id: string; active: boolean }>
) => {
  const queryClient = useQueryClient();
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;

  return useMutation<Provider, Error, { id: string; active: boolean }>({
    mutationFn: ({ id, active }) => providerService.toggleActive(id, active, teamId),
    onSuccess: (data, variables, context) => {
      // Invalidate provider queries using standardized query keys
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all(teamId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.detail(variables.id, teamId) });
      
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options
  });
};