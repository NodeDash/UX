import { useEffect, useState } from 'react';
import { config as ApiConfig } from '@/services/config.service';

/**
 * Configuration interface for smart refetching
 */
interface SmartRefetchConfig {
  /**
   * Active refresh interval when tab is visible and user is active (ms)
   * @default 5000 (5s) or value from VITE_DEFAULT_REFRESH_RATE
   */
  activeRefreshInterval?: number;
  
  /**
   * Background refresh interval when tab is visible but user is inactive (ms)
   * @default 30000 (30s)
   */
  backgroundRefreshInterval?: number;
  
  /**
   * Idle refresh interval when tab is not visible (ms)
   * @default 60000 (1m)
   */
  idleRefreshInterval?: number;
  
  /**
   * Time after which user is considered inactive (ms)
   * @default 60000 (1m)
   */
  userInactivityThreshold?: number;
  
  /**
   * Whether to disable refetching completely when tab is not visible
   * @default false
   */
  disableRefetchOnHidden?: boolean;
  
  /**
   * Whether to pause refetching when user is offline
   * @default true
   */
  pauseWhenOffline?: boolean;
  
  /**
   * Whether to enable debug logging
   * @default false
   */
  debug?: boolean;
}

type RefetchState = 'active' | 'background' | 'idle';

/**
 * Hook to provide smart refetching behavior based on user activity and tab visibility.
 * Automatically adjusts refetch frequency depending on whether the user is active,
 * the tab is visible, and the network is connected.
 * 
 * @param callback - Function to call when refetch is triggered
 * @param config - Configuration options for refetching behavior
 * @returns Current refetch interval in milliseconds
 */
export function useSmartRefetch(
  callback: () => void,
  config?: SmartRefetchConfig
): number {
  // Default configuration values
  const defaultRefreshRate = config?.activeRefreshInterval || 
    ApiConfig.api.getDefaultRefreshRate();
    
  const {
    activeRefreshInterval = defaultRefreshRate,
    backgroundRefreshInterval = 30000,
    idleRefreshInterval = 60000,
    userInactivityThreshold = 60000,
    disableRefetchOnHidden = false,
    pauseWhenOffline = true,
    debug = false
  } = config || {};

  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [isVisible, setIsVisible] = useState<boolean>(
    document.visibilityState === 'visible'
  );
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [refetchState, setRefetchState] = useState<RefetchState>('active');
  const [currentInterval, setCurrentInterval] = useState<number>(activeRefreshInterval);

  // Update visibility state
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsVisible(visible);
      
      if (visible) {
        // Reset activity time when tab becomes visible again
        setLastActivity(Date.now());
      }
      
      if (debug) {
        console.log(`Tab visibility changed: ${visible ? 'visible' : 'hidden'}`);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [debug]);

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (debug) console.log('Network: online');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      if (debug) console.log('Network: offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [debug]);

  // Update user activity
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    // Track user interactions to detect activity
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  // Determine the current refetch state
  useEffect(() => {
    const determineRefetchState = () => {
      if (!isVisible) {
        return 'idle';
      }
      
      const now = Date.now();
      const isActive = (now - lastActivity) < userInactivityThreshold;
      return isActive ? 'active' : 'background';
    };

    const newState = determineRefetchState();
    if (newState !== refetchState) {
      setRefetchState(newState);
      if (debug) {
        console.log(`Refetch state changed: ${newState}`);
      }
    }
  }, [isVisible, lastActivity, refetchState, userInactivityThreshold, debug]);

  // Update interval based on the current state
  useEffect(() => {
    let newInterval: number;
    
    switch (refetchState) {
      case 'active':
        newInterval = activeRefreshInterval;
        break;
      case 'background':
        newInterval = backgroundRefreshInterval;
        break;
      case 'idle':
        newInterval = disableRefetchOnHidden ? 0 : idleRefreshInterval;
        break;
    }
    
    if (currentInterval !== newInterval) {
      setCurrentInterval(newInterval);
      if (debug) {
        console.log(`Refetch interval changed to ${newInterval}ms (${refetchState})`);
      }
    }
  }, [
    refetchState, 
    activeRefreshInterval, 
    backgroundRefreshInterval, 
    idleRefreshInterval, 
    disableRefetchOnHidden,
    currentInterval,
    debug
  ]);

  // Set up the refetch interval
  useEffect(() => {
    // Don't set up an interval if it's disabled or we're offline and configured to pause
    if (currentInterval === 0 || (pauseWhenOffline && !isOnline)) {
      return;
    }
    
    const intervalId = setInterval(() => {
      if (debug) {
        console.log(`Triggering refetch (${refetchState})`);
      }
      callback();
    }, currentInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [currentInterval, callback, refetchState, isOnline, pauseWhenOffline, debug]);

  return currentInterval;
}