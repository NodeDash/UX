import {
  UseQueryOptions
} from '@tanstack/react-query';
import { flowService } from '@/services/flow.service';
import { Flow, FlowCreate, FlowUpdate} from '@/types';
import { queryKeys } from '../query/queryKeys';
import { createBaseApiHooks } from './baseApiHooks';
import { useTeamContext } from '@/context/TeamContext';
import { DataPriority } from '../query/queryUtils';

// Create standardized flow API hooks using the factory
const flowHooks = createBaseApiHooks<Flow, FlowCreate, FlowUpdate>({
  queryKeys: {
    all: queryKeys.flows.all,
    detail: queryKeys.flows.detail,
    history: queryKeys.flows.history
  },
  services: {
    getAll: flowService.getFlows,
    getById: flowService.getFlowById,
    create: flowService.createFlow,
    update: (id, updates, teamId) => {
      // Handle special serialization requirements for flow updates
      const serializedUpdates = JSON.parse(JSON.stringify(updates)) as FlowUpdate;
      return flowService.updateFlow(id, serializedUpdates, teamId);
    },
    delete: flowService.deleteFlow,
    getHistory: flowService.getFlowHistory
  },
  // Set data priorities for different flow queries
  priorities: {
    // Flow list is important but doesn't need ultra-frequent updates
    list: DataPriority.MEDIUM,
    // Flow details are critical when viewing/editing a flow
    detail: DataPriority.CRITICAL, 
    // Flow history is important for monitoring flow execution
    history: DataPriority.HIGH
  }
});

/**
 * Hook to fetch all flows
 */
export const useFlows = flowHooks.useAll;

/**
 * Hook to fetch a single flow by ID
 */
export const useFlow = flowHooks.useOne;

/**
 * Hook to create a new flow
 */
export const useCreateFlow = flowHooks.useCreate;

/**
 * Hook to update an existing flow
 */
export const useUpdateFlow = flowHooks.useUpdate;

/**
 * Hook to delete a flow
 */
export const useDeleteFlow = flowHooks.useDelete;

/**
 * Hook to fetch history for a specific flow
 */
export const useFlowHistory = (
  flowId?: string,
  options?: UseQueryOptions<any[]>
) => {
  const { selectedContext } = useTeamContext();
  const apiTeamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  
  // Special case for flow history - handle both specific flow and all flows cases
  if (flowId) {
    return flowHooks.useHistory(flowId, undefined, options);
  } else {
    // For all flow history, we need a custom implementation
    return flowHooks.useAll({
      queryKey: ['flow-history-all'],
      queryFn: () => {
        return flowService.getAllFlowHistory(apiTeamId);
      },
      ...options
    });
  }
};