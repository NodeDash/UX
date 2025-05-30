import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { config } from "../services/config.service";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// User activity detection configuration
const REFETCH_INTERVAL_ACTIVE = config.api.getDefaultRefreshRate();
const REFETCH_INTERVAL_INACTIVE = 3 * 60 * 1000; // 3 minutes
const USER_INACTIVITY_THRESHOLD = 60 * 1000; // 1 minute

// Create a client with improved configuration
// eslint-disable-next-line react-refresh/only-export-components
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      // Smart refetching based on app state
      refetchOnWindowFocus: config.api.isLiveMode(),
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: config.api.isLiveMode() ? 3 : 0,
      // Improve caching behavior
      gcTime: 15 * 60 * 1000, // 15 minutes
      // Handle network errors gracefully
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
    },
    mutations: {
      // Add sensible defaults for mutations
      retry: 1, // Retry mutations once by default
      retryDelay: 1000, // Wait 1 second before retrying
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Set up global online/offline detection
  useEffect(() => {
    // Configure online status management for React Query
    onlineManager.setEventListener((setOnline) => {
      // Listen to online/offline events with improved handler
      const onlineHandler = () => {
        setOnline(true);
        console.log("Network online - resuming queries");
      };

      const offlineHandler = () => {
        setOnline(false);
        console.log("Network offline - pausing background queries");
      };

      // Default state from navigator
      setOnline(navigator.onLine);

      // Add event listeners
      window.addEventListener("online", onlineHandler, false);
      window.addEventListener("offline", offlineHandler, false);

      // Cleanup
      return () => {
        window.removeEventListener("online", onlineHandler);
        window.removeEventListener("offline", offlineHandler);
      };
    });

    // DO NOT modify onlineManager.isOnline directly as it uses private fields
    // Instead, use the event system which is the supported approach
  }, []);

  // Set up focus management for React Query
  useEffect(() => {
    // Configure focus state management
    focusManager.setEventListener((handleFocus) => {
      // Listen to visibility change events
      const visibilityHandler = () =>
        handleFocus(document.visibilityState === "visible");

      // Set initial state
      handleFocus(document.visibilityState === "visible");

      // Add event listeners
      document.addEventListener("visibilitychange", visibilityHandler, false);

      // Cleanup
      return () => {
        document.removeEventListener("visibilitychange", visibilityHandler);
      };
    });
  }, []);

  // Set up user activity detection to adjust refetch frequency
  useEffect(() => {
    let lastActivity = Date.now();
    let activityTimeout: number | null = null;

    // Update queries to use appropriate refetch intervals
    const updateRefetchIntervals = () => {
      const isActive = Date.now() - lastActivity < USER_INACTIVITY_THRESHOLD;
      const interval = isActive
        ? REFETCH_INTERVAL_ACTIVE
        : REFETCH_INTERVAL_INACTIVE;

      // Update all active queries with the new interval, but respect online status
      if (navigator.onLine) {
        queryClient.setDefaultOptions({
          queries: {
            ...queryClient.getDefaultOptions().queries,
            refetchInterval: interval,
          },
        });
      } else {
        // If offline, disable automatic refetching regardless of activity
        queryClient.setDefaultOptions({
          queries: {
            ...queryClient.getDefaultOptions().queries,
            refetchInterval: false,
          },
        });
      }
    };

    // Track user interactions to detect activity
    const handleUserActivity = () => {
      lastActivity = Date.now();

      // Clear existing timeout
      if (activityTimeout) {
        window.clearTimeout(activityTimeout);
      }

      // Set a new timeout to check activity state
      activityTimeout = window.setTimeout(() => {
        updateRefetchIntervals();
      }, USER_INACTIVITY_THRESHOLD + 100);

      // Update intervals immediately if we're transitioning from inactive to active
      if (Date.now() - lastActivity >= USER_INACTIVITY_THRESHOLD) {
        updateRefetchIntervals();
      }
    };

    // Initial setup
    updateRefetchIntervals();

    // Monitor user activity events
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Also update refetch intervals when online status changes
    const onlineHandler = () => updateRefetchIntervals();
    const offlineHandler = () => updateRefetchIntervals();
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
      if (activityTimeout) {
        window.clearTimeout(activityTimeout);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
