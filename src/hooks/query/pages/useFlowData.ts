import { useMemo } from 'react';
import { 
  useFlow, 
  useDeviceHistory, 
  useFunctionHistory, 
  useIntegrationHistory, 
  useLabelHistory 
} from '@/hooks/api';

/**
 * Custom hook to centralize flow data fetching
 * Combines flow and all entity history data in one place to support flow visualization
 * 
 * @param flowId - Optional ID of the flow to fetch data for
 * @returns Object containing flow data, entity history data, loading states and error states
 */
export function useFlowData(flowId?: string) {
  // Main flow data
  const {
    data: flow,
    isLoading: flowLoading,
    error: flowError,
    refetch: refetchFlow
  } = useFlow(flowId || '');

  // History data for different entity types
  const { 
    data: deviceHistory = [],
    isLoading: deviceHistoryLoading
  } = useDeviceHistory('', flowId || '');

  const { 
    data: functionHistory = [], 
    isLoading: functionHistoryLoading 
  } = useFunctionHistory('', flowId || '');

  const { 
    data: integrationHistory = [],
    isLoading: integrationHistoryLoading
  } = useIntegrationHistory('', flowId || '');

  // Fix: Pass null instead of empty string for labelId to ensure it goes to the "all labels" branch
  const { 
    data: labelHistory = [],
    isLoading: labelHistoryLoading 
  } = useLabelHistory('', flowId || '');

  // Combine all history data
  const historyData = useMemo(() => ({
    deviceHistory,
    allFunctionHistory: functionHistory,
    allIntegrationHistory: integrationHistory,
    allLabelHistory: labelHistory
  }), [deviceHistory, functionHistory, integrationHistory, labelHistory]);

  // Overall loading state
  const isLoading = 
    flowLoading || 
    deviceHistoryLoading || 
    functionHistoryLoading || 
    integrationHistoryLoading || 
    labelHistoryLoading;

  return {
    flow,
    flowError,
    historyData,
    isLoading,
    refetchFlow
  };
}