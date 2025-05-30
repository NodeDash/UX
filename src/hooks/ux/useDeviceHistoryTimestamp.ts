import { useState, useEffect } from 'react';
import { deviceService } from '@/services/device.service';
import { useDeviceLastSeen } from './useDeviceLastSeen';

/**
 * Hook to fetch device history and calculate last seen timestamp
 * 
 * @param deviceId - The ID of the device to get history for
 * @returns Object containing the last seen timestamp, loading state, and any error
 */
export function useDeviceHistoryTimestamp(deviceId: string) {
  const [deviceHistory, setDeviceHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use the existing hook to calculate last seen timestamp from history
  const lastSeenTimestamp = useDeviceLastSeen(deviceHistory);
  
  useEffect(() => {
    const fetchDeviceHistory = async () => {
      if (!deviceId) return;
      
      try {
        setIsLoading(true);
        const history = await deviceService.getDeviceHistory(deviceId);
        setDeviceHistory(history);
      } catch (err) {
        console.error('Error fetching device history:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch device history'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeviceHistory();
  }, [deviceId]);
  
  return {
    lastSeenTimestamp,
    isLoading,
    error
  };
}