import {
  UseMutationOptions,
  useQueryClient
} from '@tanstack/react-query';
import { deviceService } from '@/services/device.service';
import { Device, DeviceCreate, DeviceUpdate, DeviceWithLabels } from '@/types';
import { queryKeys } from '../query/queryKeys';
import { createBaseApiHooks } from './baseApiHooks';
import { DataPriority } from '../query/queryUtils';

// Create standardized device API hooks using the factory
const deviceHooks = createBaseApiHooks<DeviceWithLabels, DeviceCreate, DeviceUpdate>({
  queryKeys: queryKeys.devices,
  services: {
    getAll: deviceService.getDevices,
    getById: deviceService.getDeviceById,
    create: deviceService.createDevice,
    update: deviceService.updateDevice,
    delete: deviceService.deleteDevice,
  },
  priorities: {
    list: DataPriority.HIGH,
    detail: DataPriority.CRITICAL,
    history: DataPriority.HIGH
  }
});

/**
 * Hook to fetch all devices
 * 
 * @returns Query result containing the list of all devices, loading state, and error state
 */
export const useDevices = deviceHooks.useAll;

/**
 * Hook to fetch a single device by ID
 * 
 * @param id - The unique identifier of the device to fetch
 * @param options - Optional React Query configuration options
 * @returns Query result containing device data, loading state, and error state
 */
export const useDevice = deviceHooks.useOne;

/**
 * Hook to create a new device
 * Returns a mutation that automatically invalidates relevant queries
 * 
 * @param options - Optional React Query mutation options
 * @returns Mutation object with mutate function and state
 */
export const useCreateDevice = (
  options?: UseMutationOptions<Device, Error, DeviceCreate>
) => {
  return deviceHooks.useCreate(options);
};

/**
 * Hook to update an existing device
 * Returns a mutation that automatically invalidates relevant queries
 */
export const useUpdateDevice = (
  options?: UseMutationOptions<Device, Error, { id: string; updates: DeviceUpdate }>
) => {
  return deviceHooks.useUpdate(options);
};

/**
 * Hook to delete a device
 * Returns a mutation that automatically invalidates relevant queries
 */
export const useDeleteDevice = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const baseDelete = deviceHooks.useDelete({
    onSuccess: (data, variables, context) => {
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }

      // Additionally invalidate label queries since device-label associations are removed
      queryClient.invalidateQueries({ queryKey: queryKeys.labels.all() });
    },
    ...options
  });
  
  return baseDelete;
};
