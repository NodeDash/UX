import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-endpoints';
import {
  Integration,
  IntegrationCreate,
  IntegrationUpdate,
  IntegrationHistory,
} from '@/types';

/**
 * Service for handling integration-related API calls.
 */
export const integrationService = {
  /**
   * Fetches all integrations.
   * @param {number} [teamId] - Optional team ID to filter integrations by team.
   * @returns {Promise<Integration[]>} Promise resolving to an array of integrations.
   */
  getIntegrations: (teamId?: number): Promise<Integration[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.integrations.base, { params });
  },

  /**
   * Fetches a specific integration by its ID.
   * @param {string} id - The ID of the integration to retrieve.
   * @param {number} [teamId] - Optional team ID to filter by team context.
   * @returns {Promise<Integration>} Promise resolving to the integration.
   */
  getIntegrationById: (id: string, teamId?: number): Promise<Integration> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.integrations.get(id), { params });
  },

  /**
   * Creates a new integration.
   * @param {IntegrationCreate} data - The data for the new integration.
   * @param {number} [teamId] - Optional team ID for the integration context.
   * @returns {Promise<Integration>} Promise resolving to the created integration.
   */
  createIntegration: (
    data: IntegrationCreate,
    teamId?: number
  ): Promise<Integration> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.post(API_ENDPOINTS.integrations.base, data, { params });
  },

  /**
   * Updates an existing integration.
   * @param {string} id - The ID of the integration to update.
   * @param {IntegrationUpdate} data - The updated data.
   * @param {number} [teamId] - Optional team ID for the integration context.
   * @returns {Promise<Integration>} Promise resolving to the updated integration.
   */
  updateIntegration: (
    id: string,
    data: IntegrationUpdate,
    teamId?: number
  ): Promise<Integration> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.put(API_ENDPOINTS.integrations.update(id), data, { params });
  },

  /**
   * Deletes an integration by ID.
   * @param {string} id - The ID of the integration to delete.
   * @param {number} [teamId] - Optional team ID for the integration context.
   * @returns {Promise<void>} Promise resolving when deletion is successful.
   */
  deleteIntegration: (id: string, teamId?: number): Promise<void> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.delete(API_ENDPOINTS.integrations.delete(id), { params });
  },

  /**
   * Retrieves history for a specific integration.
   * @param {string} integrationId - The ID of the integration to get history for.
   * @param {number} [teamId] - Optional team ID for the integration context.
   * @returns {Promise<IntegrationHistory[]>} Promise resolving to an array of integration history records.
   */
  getIntegrationHistory: (
    integrationId: string,
    teamId?: number
  ): Promise<IntegrationHistory[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient
      .get(API_ENDPOINTS.integrations.history(integrationId), { params });
  },

  /**
   * Retrieves history for all integrations.
   * @param {number} [teamId] - Optional team ID to filter by team context.
   * @returns {Promise<IntegrationHistory[]>} Promise resolving to an array of all integration history records.
   */
  getAllIntegrationHistory: (teamId?: number): Promise<IntegrationHistory[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient
      .get(API_ENDPOINTS.integrations.allHistory, { params });
  },
};
