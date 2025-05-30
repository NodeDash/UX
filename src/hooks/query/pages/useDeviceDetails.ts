import { useDevice, useLabels } from '@/hooks/api';

/**
 * Hook to fetch device details and related data
 * 
 * @param deviceId - ID of the device to fetch
 * @returns Object containing device data, labels, loading states, and error information
 */
export function useDeviceDetails(deviceId: string) {
  
  // Fetch device data
  const {
    data: device,
    isLoading: isDeviceLoading,
    error: deviceError,
    refetch: refetchDevice,
  } = useDevice(deviceId);

  // Fetch labels data with a longer stale time
  const { 
    data: allLabels = [], 
    isLoading: isLabelsLoading 
  } = useLabels();

  const isLoading = isDeviceLoading || isLabelsLoading;
  const error = deviceError?.message;

  return {
    device,
    allLabels,
    isLoading,
    error,
    refetchDevice
  };
}