import { useTranslation } from 'react-i18next';
import { Device } from '@/types';
import { 
  useDevices, 
  useDeleteDevice, 
  useCreateDevice, 
  useUpdateDevice 
} from '@/hooks/api';
import { useTableData } from './useTableData';

/**
 * Custom hook to provide all device table operations in a single place
 * 
 * @returns Consolidated object containing device data, mutation functions, loading states, and error handling
 */
export function useDevicesTable() {
  const { t } = useTranslation();

  const devicesQuery = useDevices();
  const deleteDeviceMutation = useDeleteDevice();
  const createDeviceMutation = useCreateDevice();
  const updateDeviceMutation = useUpdateDevice();

  // Use the standardized table data hook with our device-specific operations
  return useTableData<Device, any, any>({
    queryResult: devicesQuery,
    mutations: {
      delete: deleteDeviceMutation.mutateAsync,
      create: createDeviceMutation.mutateAsync,
      update: (id, updates) => updateDeviceMutation.mutateAsync({ id, updates }),
    },
    messages: {
      entityName: "device",
      deleted: t("devices.deviceDeleted"),
      created: t("devices.deviceCreated"),
      updated: t("devices.deviceUpdated"),
      failedToDelete: t("devices.errorDeleting"),
      failedToCreate: t("devices.errorCreating"),
      failedToUpdate: t("devices.errorUpdating"),
      confirmDelete: t("devices.confirmDeleteDevice"),
    },
    
  });
}