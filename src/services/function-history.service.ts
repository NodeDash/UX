import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-endpoints';
import { FunctionHistory } from '@/types';

/**
 * Retrieves history for a specific function.
 * @param {string} functionId - The ID of the function to get history for.
 * @param {number} [teamId] - Optional team ID to filter by team context.
 * @returns {Promise<FunctionHistory[]>} Promise resolving to an array of function history records.
 */
export const getFunctionHistory = (functionId: string, teamId?: number): Promise<FunctionHistory[]> => {
  const params = teamId ? { team_id: teamId } : undefined;
  return apiClient
    .get(API_ENDPOINTS.functions.history(functionId), { params });
};

/**
 * Retrieves history for all functions.
 * @param {number} [teamId] - Optional team ID to filter by team context.
 * @returns {Promise<FunctionHistory[]>} Promise resolving to an array of all function history records.
 */
export const getAllFunctionHistory = (teamId?: number): Promise<FunctionHistory[]> => {
  const params = teamId ? { team_id: teamId } : undefined;
  return apiClient
    .get(API_ENDPOINTS.functions.allHistory, { params });
};