import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-endpoints';
import { Flow, FlowCreate, FlowUpdate, FlowLayout } from '@/types';

/**
 * Service for handling flow-related API calls.
 */
export const flowService = {
  /**
   * Fetches all flows.
   * @param {number} [teamId] - Optional team ID to filter flows by team.
   * @returns {Promise<Flow[]>} Promise resolving to an array of flows.
   */
  getFlows: (teamId?: number): Promise<Flow[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.flows.base, { params });
  },

  /**
   * Fetches a specific flow by its ID.
   * @param {string} id - The ID of the flow to retrieve.
   * @param {number} [teamId] - Optional team ID to filter by team context.
   * @returns {Promise<Flow>} Promise resolving to the flow.
   */
  getFlowById: (id: string, teamId?: number): Promise<Flow> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.flows.get(id), { params });
  },

  /**
   * Creates a new flow.
   * @param {FlowCreate} data - The data for the new flow.
   * @param {number} [teamId] - Optional team ID for the flow context.
   * @returns {Promise<Flow>} Promise resolving to the created flow.
   */
  createFlow: (data: FlowCreate, teamId?: number): Promise<Flow> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.post(API_ENDPOINTS.flows.base, data, { params });
  },

  /**
   * Updates an existing flow.
   * @param {string} id - The ID of the flow to update.
   * @param {FlowUpdate} data - The updated data.
   * @param {number} [teamId] - Optional team ID for the flow context.
   * @returns {Promise<Flow>} Promise resolving to the updated flow.
   */
  updateFlow: (id: string, data: FlowUpdate, teamId?: number): Promise<Flow> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.put(API_ENDPOINTS.flows.update(id), data, { params });
  },

  /**
   * Deletes a flow by ID.
   * @param {string} id - The ID of the flow to delete.
   * @param {number} [teamId] - Optional team ID for the flow context.
   * @returns {Promise<void>} Promise resolving when deletion is successful.
   */
  deleteFlow: (id: string, teamId?: number): Promise<void> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.delete(API_ENDPOINTS.flows.delete(id), { params });
  },

  /**
   * Retrieves the layout for a specific flow.
   * @param {string} id - The ID of the flow to get layout for.
   * @param {number} [teamId] - Optional team ID for the flow context.
   * @returns {Promise<FlowLayout>} Promise resolving to the flow layout.
   */
  getFlowLayout: (id: string, teamId?: number): Promise<FlowLayout> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.flows.layout(id), { params });
  },

  /**
   * Updates the layout for a specific flow.
   * @param {string} id - The ID of the flow to update layout for.
   * @param {FlowLayout} layout - The new layout data.
   * @param {number} [teamId] - Optional team ID for the flow context.
   * @returns {Promise<FlowLayout>} Promise resolving to the updated flow layout.
   */
  updateFlowLayout: (
    id: string,
    layout: FlowLayout,
    teamId?: number
  ): Promise<FlowLayout> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.put(API_ENDPOINTS.flows.layout(id), layout, { params });
  },

  /**
   * Retrieves history for a specific flow.
   * @param {string} flowId - The ID of the flow to get history for.
   * @param {number} [teamId] - Optional team ID for the flow context.
   * @returns {Promise<any[]>} Promise resolving to an array of flow history records.
   */
  getFlowHistory: (flowId: string, teamId?: number): Promise<any[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.flows.history(flowId), { params });
  },

  /**
   * Retrieves history for all flows.
   * @param {number} [teamId] - Optional team ID to filter by team context.
   * @returns {Promise<any[]>} Promise resolving to an array of all flow history records.
   */
  getAllFlowHistory: (teamId?: number): Promise<any[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.flows.allHistory, { params });
  },
};