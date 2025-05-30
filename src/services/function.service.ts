import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-endpoints';
import {
  Function as FlowFunction,
  FunctionCreate,
  FunctionUpdate,
  FunctionHistory,
} from '@/types';

/**
 * Service for handling function-related API calls.
 */
export const functionService = {
  /**
   * Fetches all functions.
   * @param {number} [teamId] - Optional team ID to filter functions by team.
   * @returns {Promise<FlowFunction[]>} Promise resolving to an array of functions.
   */
  getFunctions: (teamId?: number): Promise<FlowFunction[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.functions.base, { params });
  },

  /**
   * Fetches a specific function by its ID.
   * @param {string} id - The ID of the function to retrieve.
   * @param {number} [teamId] - Optional team ID to filter by team context.
   * @returns {Promise<FlowFunction>} Promise resolving to the function.
   */
  getFunctionById: (id: string, teamId?: number): Promise<FlowFunction> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.functions.get(id), { params });
  },

  /**
   * Creates a new function.
   * @param {FunctionCreate} data - The data for the new function.
   * @param {number} [teamId] - Optional team ID for the function context.
   * @returns {Promise<FlowFunction>} Promise resolving to the created function.
   */
  createFunction: (
    data: FunctionCreate,
    teamId?: number
  ): Promise<FlowFunction> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.post(API_ENDPOINTS.functions.base, data, { params });
  },

  /**
   * Updates an existing function.
   * @param {string} id - The ID of the function to update.
   * @param {FunctionUpdate} data - The updated data.
   * @param {number} [teamId] - Optional team ID for the function context.
   * @returns {Promise<FlowFunction>} Promise resolving to the updated function.
   */
  updateFunction: (
    id: string,
    data: FunctionUpdate,
    teamId?: number
  ): Promise<FlowFunction> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.put(API_ENDPOINTS.functions.update(id), data, { params });
  },

  /**
   * Deletes a function by ID.
   * @param {string} id - The ID of the function to delete.
   * @param {number} [teamId] - Optional team ID for the function context.
   * @returns {Promise<void>} Promise resolving when deletion is successful.
   */
  deleteFunction: (id: string, teamId?: number): Promise<void> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.delete(API_ENDPOINTS.functions.delete(id), { params });
  },

  /**
   * Retrieves history for a specific function.
   * @param {string} functionId - The ID of the function to get history for.
   * @param {number} [teamId] - Optional team ID for the function context.
   * @returns {Promise<FunctionHistory[]>} Promise resolving to an array of function history records.
   */
  getFunctionHistory: (
    functionId: string,
    teamId?: number
  ): Promise<FunctionHistory[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient
      .get(API_ENDPOINTS.functions.history(functionId), { params })
  },

  /**
   * Retrieves history for all functions.
   * @param {number} [teamId] - Optional team ID to filter by team context.
   * @returns {Promise<FunctionHistory[]>} Promise resolving to an array of all function history records.
   */
  getAllFunctionHistory: (teamId?: number): Promise<FunctionHistory[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient
      .get(API_ENDPOINTS.functions.allHistory, { params })
  },
};

