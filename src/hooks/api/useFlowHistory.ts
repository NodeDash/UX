/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo } from 'react';
import { AppNode } from '../../components/nodes/types';
import { useTeamContext } from '@/context/TeamContext';
import { useQueries } from '@tanstack/react-query';
import { queryKeys } from '../query/queryKeys';
// Import the service functions directly
import { getFunctionHistory } from '@/services/function-history.service';
import { integrationService } from '@/services/integration.service';
import { labelService } from '@/services/label.service';
import { useSmartRefetch } from '../query/useSmartRefetch';

/**
 * Hook to manage flow entity history (functions, integrations, devices, labels)
 * Using TanStack Query for efficient data fetching and caching
 * 
 * @param nodes - Array of nodes in the current flow
 * @param deviceHistory - Optional device history data
 * @param flowId - Optional ID of the current flow for filtering history
 * @returns Object containing history data for all entity types in the flow and utility functions
 */
export function useFlowHistory(nodes: AppNode[], deviceHistory: any[] = [], flowId?: string) {
  const { selectedContext } = useTeamContext();
  const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;

  /**
   * Extract unique entity IDs from nodes - memoize to prevent unnecessary recalculations
   */
  const { functionIds, integrationIds, labelIds } = useMemo(() => nodes.reduce<{
    functionIds: string[];
    integrationIds: string[];
    labelIds: string[];
  }>((acc, node) => {
    if (node.data?.nodeType === "function" && node.data?.entityId) {
      if (!acc.functionIds.includes(node.data.entityId)) {
        acc.functionIds.push(node.data.entityId);
      }
    } else if (node.data?.nodeType === "integration" && node.data?.entityId) {
      if (!acc.integrationIds.includes(node.data.entityId)) {
        acc.integrationIds.push(node.data.entityId);
      }
    } else if (node.data?.nodeType === "label" && node.data?.entityId) {
      if (!acc.labelIds.includes(node.data.entityId)) {
        acc.labelIds.push(node.data.entityId);
      }
    }
    return acc;
  }, { functionIds: [], integrationIds: [], labelIds: [] }), [nodes]);

  // Use React Query's useQueries to fetch all function histories in parallel
  const functionQueries = useQueries({
    queries: functionIds.map(id => ({
      queryKey: queryKeys.functions.history(id),
      queryFn: () => getFunctionHistory(id, teamId),
      // Remove hardcoded refetchInterval - will use smart refetch instead
      staleTime: 30 * 1000, // 30 seconds stale time
      enabled: !!id,
    })),
  });

  // Use React Query's useQueries to fetch all integration histories in parallel
  const integrationQueries = useQueries({
    queries: integrationIds.map(id => ({
      queryKey: queryKeys.integrations.history(id, flowId, teamId),
      queryFn: () => integrationService.getIntegrationHistory(id, teamId),
      // Remove hardcoded refetchInterval - will use smart refetch instead
      staleTime: 30 * 1000, // 30 seconds stale time
      enabled: !!id,
    })),
  });

  // Use React Query's useQueries to fetch all label histories in parallel
  const labelQueries = useQueries({
    queries: labelIds.map(id => ({
      queryKey: queryKeys.labels.history(id, flowId, teamId),
      queryFn: () => labelService.getLabelHistory(id, teamId),
      // Remove hardcoded refetchInterval - will use smart refetch instead
      staleTime: 30 * 1000, // 30 seconds stale time
      enabled: !!id,
    })),
  });

  /**
   * Helper function to refetch all queries
   * @returns void
   */
  const refetchAllQueries = useCallback(() => {
    functionQueries.forEach(query => query.refetch());
    integrationQueries.forEach(query => query.refetch());
    labelQueries.forEach(query => query.refetch());
  }, [functionQueries, integrationQueries, labelQueries]);
  
  // Apply smart refetch strategy for all queries
  useSmartRefetch(refetchAllQueries, {
    // Flow history is important for visualization, so keep relatively fresh when active
    activeRefreshInterval: 30000, // 30 seconds when user is active
    backgroundRefreshInterval: 60000, // 1 minute when tab visible but user inactive
    idleRefreshInterval: 120000, // 2 minutes when tab not visible
    // Disable refetching when tab is hidden if we're viewing a specific flow
    disableRefetchOnHidden: !!flowId,
  });

  /**
   * Convert query results to the expected history format - memoize for performance
   */
  const functionHistory = useMemo(() => 
    functionIds.reduce<Record<string, any[]>>((acc, id, index) => {
      acc[id] = functionQueries[index]?.data || [];
      return acc;
    }, {}), 
    [functionIds, functionQueries]
  );

  const integrationHistory = useMemo(() => 
    integrationIds.reduce<Record<string, any[]>>((acc, id, index) => {
      acc[id] = integrationQueries[index]?.data || [];
      return acc;
    }, {}),
    [integrationIds, integrationQueries]
  );

  const labelHistory = useMemo(() =>
    labelIds.reduce<Record<string, any[]>>((acc, id, index) => {
      acc[id] = labelQueries[index]?.data || [];
      return acc;
    }, {}),
    [labelIds, labelQueries]
  );

  /**
   * Helper function to get device ID from history entry (handles both formats)
   * @param entry - History entry object that may contain deviceId or device_id
   * @returns String device ID if available, undefined otherwise
   */
  const getDeviceIdFromEntry = useCallback((entry: any): string | undefined => {
    if (entry.deviceId) {
      return String(entry.deviceId);
    }
    if (entry.device_id) {
      return String(entry.device_id);
    }
    return undefined;
  }, []);

  /**
   * Check if an entity has recent activity (within the last 24 hours)
   * @param entityId - ID of the entity to check for activity
   * @param nodeType - Type of the entity ("device", "function", "integration", or "label")
   * @returns Boolean indicating whether the entity has recent activity
   */
  const hasRecentActivity = useCallback(
    (entityId: string | undefined, nodeType: string | undefined) => {
      if (!entityId || !nodeType) return false;

      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      // Check appropriate history based on node type
      if (nodeType === "device") {
        // Device history - should be pre-filtered by flowId from the API call
        if (deviceHistory.length === 0) return false;
        
        return deviceHistory.some((entry) => {
          // Check both deviceId and device_id fields
          const entryDeviceId = getDeviceIdFromEntry(entry);
          if (!entryDeviceId) return false;
          
          const timestamp = new Date(entry.timestamp);
          return entryDeviceId === entityId && timestamp >= twentyFourHoursAgo;
        });
      } else if (nodeType === "function") {
        // Function history
        const history = functionHistory[entityId] || [];
        return history.some((entry) => {
          const timestamp = new Date(entry.timestamp);
          return timestamp >= twentyFourHoursAgo;
        });
      } else if (nodeType === "integration") {
        // Integration history
        const history = integrationHistory[entityId] || [];

        return history.some((entry) => {
          const timestamp = new Date(entry.timestamp);
          return timestamp >= twentyFourHoursAgo;
        });
      } else if (nodeType === "label") {
        // Label history
        const history = labelHistory[entityId] || [];
        return history.some((entry) => {
          const timestamp = new Date(entry.timestamp);
          return timestamp >= twentyFourHoursAgo;
        });
      }

      return false;
    },
    [deviceHistory, functionHistory, integrationHistory, labelHistory, getDeviceIdFromEntry]
  );

  /**
   * Check if an entity has VERY recent activity (within the last 5 seconds)
   * This is used for dynamic edge animations
   * @param entityId - ID of the entity to check for activity
   * @param nodeType - Type of the entity ("device", "function", "integration", or "label")
   * @returns Boolean indicating whether the entity has very recent activity
   */
  const hasVeryRecentActivity = useCallback(
    (entityId: string | undefined, nodeType: string | undefined) => {
      if (!entityId || !nodeType) return false;
      
      const fiveSecondsAgo = new Date();
      fiveSecondsAgo.setSeconds(fiveSecondsAgo.getSeconds() - 5);

      // Check appropriate history based on node type
      if (nodeType === "device") {
        // Device history
        if (deviceHistory.length === 0) return false;
        
        return deviceHistory.some((entry) => {
          // Check both deviceId and device_id fields
          const entryDeviceId = getDeviceIdFromEntry(entry);
          if (!entryDeviceId) return false;
          
          const timestamp = new Date(entry.timestamp);
          return entryDeviceId === entityId && timestamp >= fiveSecondsAgo;
        });
      } else if (nodeType === "function") {
        // Function history
        const history = functionHistory[entityId] || [];
        return history.some((entry) => {
          const timestamp = new Date(entry.timestamp);
          return timestamp >= fiveSecondsAgo;
        });
      } else if (nodeType === "integration") {
        // Integration history
        const history = integrationHistory[entityId] || [];
        return history.some((entry) => {
          const timestamp = new Date(entry.timestamp);
          return timestamp >= fiveSecondsAgo;
        });
      } else if (nodeType === "label") {
        // Label history
        const history = labelHistory[entityId] || [];
        return history.some((entry) => {
          const timestamp = new Date(entry.timestamp);
          return timestamp >= fiveSecondsAgo;
        });
      }

      return false;
    },
    [deviceHistory, functionHistory, integrationHistory, labelHistory]
  );

  /**
   * Get the status from the latest history entry for a node
   * @param entityId - ID of the entity
   * @param nodeType - Type of the entity ("device", "function", "integration", or "label")
   * @returns Status string based on the latest history entry, or 'no_history' if no history is available
   */
  const getLatestStatusForEntity = useCallback(
    (entityId: string | undefined, nodeType: string | undefined) => {
      if (!entityId || !nodeType) return 'no_history';

      // Get the appropriate history based on node type
      // Note: History data is already pre-filtered by flowId at the API level
      let relevantHistory: any[] = [];

      if (nodeType === "device") {
        // For devices, filter the device history by entityId
        // Device history is already filtered by flowId when fetched
        relevantHistory = deviceHistory.filter(
          (entry) => {
            const entryDeviceId = getDeviceIdFromEntry(entry);
            return entryDeviceId === entityId;
          }
        );
      } else if (nodeType === "function") {
        // Function history is already filtered by flowId when fetched
        relevantHistory = functionHistory[entityId] || [];
      } else if (nodeType === "integration") {
        // Integration history is already filtered by flowId when fetched
        relevantHistory = integrationHistory[entityId] || [];

      } else if (nodeType === "label") {
        // Label history is already filtered by flowId when fetched
        relevantHistory = labelHistory[entityId] || [];
      }

      // If no history, return 'no_history' so nodes display with the neutral gray status
      if (!relevantHistory.length) return 'no_history';

      // Sort by timestamp to get the latest entry
      const sortedHistory = [...relevantHistory].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Get the latest entry
      const latestEntry = sortedHistory[0];
      
      // For device history, status might not be available
      if (nodeType === "device") {
        // If status exists, use it
        if (latestEntry.status) {
          return latestEntry.status;
        }
        
        // Otherwise derive status from other fields or return a default
        // For devices, we can check the event type or other fields
        if (latestEntry.event === 'error' || latestEntry.error) {
          return 'error';
        }
        
        // Check for data.success if it exists
        if (latestEntry.data && latestEntry.data.success === false) {
          return 'error';
        }
        
        // Default to 'success' for devices with activity
        return 'success';
      } else if (nodeType === "label") {
        // For labels, use status if available or derive it
        const status = latestEntry.status;

        if (status === "error" || status === "partial_success") {
          return status;
        }

        // Only return 'success' if there's a status field set to 'success'
        if (status === "success") {
          return "success";
        }
        
        // If no explicit status, return 'no_history' for neutral color
        return 'no_history';
      } else {
        // For functions and integrations, use the explicit status if available
        const status = latestEntry.status;

        // Return the exact status if it exists
        if (status === "error" || status === "partial_success" || status === "success") {
          return status;
        }

        // If status exists but isn't one of the recognized values, return 'no_history'
        // This will show the neutral gray color
        return 'no_history';
      }
    },
    [deviceHistory, functionHistory, integrationHistory, labelHistory]
  );

  /**
   * Return loading status in addition to the history data
   */
  const isLoading = 
    functionQueries.some(query => query.isLoading) ||
    integrationQueries.some(query => query.isLoading) ||
    labelQueries.some(query => query.isLoading);

  return {
    functionHistory,
    integrationHistory,
    labelHistory,
    hasRecentActivity,
    hasVeryRecentActivity,
    getLatestStatusForEntity,
    isLoading
  };
}