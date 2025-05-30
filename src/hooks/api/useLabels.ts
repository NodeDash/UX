import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query';
import { labelService } from '@/services/label.service';
import { Label, LabelCreate, LabelUpdate, Device } from '@/types';
import { queryKeys } from '../query/queryKeys';
import { useTeamContext } from '@/context/TeamContext';
import { createBaseApiHooks } from './baseApiHooks';
import { config } from '@/services/config.service';
import { DataPriority } from '../query/queryUtils';

/**
 * Creates standardized label API hooks using the hook factory
 * Uses specific query keys and service functions for label-related operations
 */
const labelHooks = createBaseApiHooks<Label, LabelCreate, LabelUpdate>({
  queryKeys: {
    all: queryKeys.labels.all,
    detail: queryKeys.labels.detail,
    history: queryKeys.labels.history
  },
  services: {
    getAll: labelService.getLabels,
    getById: labelService.getLabelById,
    create: labelService.createLabel,
    update: labelService.updateLabel,
    delete: labelService.deleteLabel,
    getHistory: labelService.getLabelHistory
  },
  // Set data priorities for different label queries
  priorities: {
    // Label list is used in selectors and doesn't change often
    list: DataPriority.LOW,
    // Label details are important when viewing a specific label
    detail: DataPriority.MEDIUM,
    // Label history is less critical for real-time updates
    history: DataPriority.LOW
  }
});

/**
 * Hook to fetch all labels for the current team context
 * @returns Object containing labels data, loading state, error state, and refetch function
 */
export const useLabels = labelHooks.useAll;

/**
 * Hook to fetch a single label by ID
 * @param id - The ID of the label to fetch
 * @returns Object containing label data, loading state, error state, and refetch function
 */
export const useLabel = labelHooks.useOne;

/**
 * Hook to create a new label
 * @returns Object containing mutation function and mutation state
 */
export const useCreateLabel = (
  options?: UseMutationOptions<Label, Error, LabelCreate>
) => {
  const queryClient = useQueryClient();
  
  return labelHooks.useCreate({
    onSuccess: (data, variables, context) => {
      // If label is created with devices, invalidate device queries too
      if (variables.device_ids && variables.device_ids.length > 0) {
        queryClient.invalidateQueries({ queryKey: queryKeys.devices.all() });
      }
      
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options
  });
};

/**
 * Hook to update an existing label
 * Returns a mutation that automatically invalidates relevant queries
 */
export const useUpdateLabel = (
  options?: UseMutationOptions<Label, Error, { id: string; updates: LabelUpdate }>
) => {
  const queryClient = useQueryClient();
  
  return labelHooks.useUpdate({
    onSuccess: (data, variables, context) => {
      // Also invalidate device queries when device_ids are updated
      if (variables.updates.device_ids) {
        queryClient.invalidateQueries({ queryKey: queryKeys.devices.all() });
      }
      
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options
  });
};

/**
 * Hook to delete a label
 * Returns a mutation that automatically invalidates relevant queries
 */
export const useDeleteLabel = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  
  return labelHooks.useDelete({
    onSuccess: (data, variables, context) => {
      // Also invalidate device queries when a label is deleted
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.all() });
      
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options
  });
};

/**
 * Hook to fetch history for a specific label or all labels
 */
export const useLabelHistory = (
  labelId?: string,
  flowId?: string,
  options?: Omit<UseQueryOptions<any[]>, 'queryKey' | 'queryFn'>
) => {
  const { selectedContext } = useTeamContext();
  const apiTeamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  
  // Check if labelId is a valid non-empty string
  const hasValidLabelId = !!labelId && labelId.trim().length > 0;
  
  if (hasValidLabelId) {
    // Use direct useQuery for specific label history with proper typing
    return useQuery({
      queryKey: queryKeys.labels.history(labelId!, flowId, apiTeamId),
      queryFn: () => labelService.getLabelHistory(labelId!, apiTeamId),
      refetchInterval: config.api.getDefaultRefreshRate(),
      select: (data) => {
        if (flowId && Array.isArray(data)) {
          return data.filter(item => parseInt(item.flow_id) === parseInt(flowId));
        }
        return data;
      },
      ...options
    });
  }
  
  // For all labels history
  return useQuery({
    queryKey: ['label-history-all', apiTeamId ?? 'user', flowId || 'all'],
    queryFn: () => labelService.getAllLabelHistory(apiTeamId),
    refetchInterval: config.api.getDefaultRefreshRate(),
    select: (data) => {
      if (flowId && Array.isArray(data)) {
        return data.filter(item => parseInt(item.flow_id) === parseInt(flowId));
      }
      return data;
    },
    ...options
  });
}

/**
 * Hook to fetch devices associated with a specific label
 */
export const useDevicesByLabel = (labelId: string, options?: UseQueryOptions<Device[]>) => {
  return labelHooks.useOne(labelId, {
    queryKey: [...queryKeys.labels.detail(labelId), 'devices'],
    queryFn: () => {
      const { selectedContext } = useTeamContext();
      const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
      return labelService.getDevicesByLabel(labelId, teamId);
    },
    ...options
  });
};

/**
 * Hook to add a device to a label
 */
export const useAddDeviceToLabel = (
  options?: UseMutationOptions<void, Error, { labelId: string; deviceId: string }>
) => {
  const queryClient = useQueryClient();
  const { selectedContext } = useTeamContext();

  return useMutation<void, Error, { labelId: string; deviceId: string }>({
    mutationFn: ({ labelId, deviceId }) => {
      const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
      return labelService.addDeviceToLabel(labelId, deviceId, teamId);
    },
    onSuccess: (_, { labelId, deviceId }) => {
      const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
      
      // Invalidate all related queries using the standardized query keys
      queryClient.invalidateQueries({ queryKey: queryKeys.labels.all(teamId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.labels.detail(labelId, teamId) });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.labels.detail(labelId, teamId), 'devices'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.detail(deviceId, teamId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.all(teamId) });
      
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(_, { labelId, deviceId }, undefined);
      }
    },
    ...options
  });
};

/**
 * Hook to remove a device from a label
 */
export const useRemoveDeviceFromLabel = (
  options?: UseMutationOptions<void, Error, { labelId: string; deviceId: string }>
) => {
  const queryClient = useQueryClient();
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;

  return useMutation<void, Error, { labelId: string; deviceId: string }>({
    mutationFn: ({ labelId, deviceId }) => labelService.removeDeviceFromLabel(labelId, deviceId, teamId),
    onSuccess: (_, { labelId, deviceId }) => {
      // Invalidate all related queries using the standardized query keys
      queryClient.invalidateQueries({ queryKey: queryKeys.labels.all(teamId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.labels.detail(labelId, teamId) });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.labels.detail(labelId, teamId), 'devices'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.detail(deviceId, teamId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.all(teamId) });
      
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(_, { labelId, deviceId }, undefined);
      }
    },
    ...options
  });
};