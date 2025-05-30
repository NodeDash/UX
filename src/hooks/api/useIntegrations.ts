import {
  UseQueryOptions,
} from '@tanstack/react-query';
import { integrationService } from '@/services/integration.service';
import { Integration, IntegrationCreate, IntegrationUpdate, IntegrationHistory } from '@/types';
import { queryKeys } from '../query/queryKeys';
import { createBaseApiHooks } from './baseApiHooks';
import { useTeamContext } from '@/context/TeamContext';
import { DataPriority } from '../query/queryUtils';

// Create standardized integration API hooks using the factory
const integrationHooks = createBaseApiHooks<Integration, IntegrationCreate, IntegrationUpdate>({
  queryKeys: {
    all: queryKeys.integrations.all,
    detail: queryKeys.integrations.detail,
    history: queryKeys.integrations.history
  },
  services: {
    getAll: integrationService.getIntegrations,
    getById: integrationService.getIntegrationById,
    create: integrationService.createIntegration,
    update: integrationService.updateIntegration,
    delete: integrationService.deleteIntegration,
    getHistory: integrationService.getIntegrationHistory
  },
  // Set data priorities for different integration queries
  priorities: {
    // Integration list is configuration data that doesn't change frequently
    list: DataPriority.MEDIUM,
    // Integration details are important when configuring them
    detail: DataPriority.HIGH,
    // Integration history is critical for monitoring external system interactions
    history: DataPriority.CRITICAL
  }
});

/**
 * Hook to fetch all integrations
 */
export const useIntegrations = integrationHooks.useAll;

/**
 * Hook to fetch a single integration by ID
 */
export const useIntegration = integrationHooks.useOne;

/**
 * Hook to create a new integration
 */
export const useCreateIntegration = integrationHooks.useCreate;

/**
 * Hook to update an existing integration
 */
export const useUpdateIntegration = integrationHooks.useUpdate;

/**
 * Hook to delete an integration
 */
export const useDeleteIntegration = integrationHooks.useDelete;

/**
 * Hook to fetch history for a specific integration
 */
export const useIntegrationHistory = (
  integrationId?: string,
  flowId?: string,
  options?: UseQueryOptions<IntegrationHistory[]>
) => {
  const { selectedContext } = useTeamContext();
  const apiTeamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
  
  // For specific integration history
  if (integrationId) {
    return integrationHooks.useHistory(integrationId, { flowId }, options);
  } 
  
  // For all integrations history
  return integrationHooks.useAll({
    queryKey: ['integration-history-all', flowId || 'all'],
    queryFn: () => {
      const response = integrationService.getAllIntegrationHistory(apiTeamId);
      
      if (flowId) {
        return response.then(data => 
          Array.isArray(data) ? data.filter(item => String(item.flowId) === flowId) : []
        );
      }
      
      return response;
    },
    ...options
  });
};
