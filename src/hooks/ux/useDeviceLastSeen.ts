import { useMemo } from 'react';

export interface DeviceHistoryEntry {
  event: string;
  timestamp: string;
  [key: string]: any;
}

/**
 * Custom hook to calculate the last seen timestamp from device history.
 * @param deviceHistory Array of device history entries
 * @returns Object with the timestamp and formatted time when the device was last seen
 */
export function useDeviceLastSeen(deviceHistory: DeviceHistoryEntry[] = []) {
  return useMemo(() => {
    // Find the latest uplink event by timestamp
    const lastEvent = deviceHistory
      .filter((entry) => entry.event === "uplink")
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .at(0);
      
    if (!lastEvent) return { timestamp: null, formattedTime: null };
    
    const timestamp = lastEvent.timestamp;
    
    // Calculate time ago for display
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    let formattedTime: string;
    
    if (diffMins < 60) {
      formattedTime = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      formattedTime = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      formattedTime = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    
    return { timestamp, formattedTime };
  }, [deviceHistory]);
}