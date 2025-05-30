import { FlowHistoryEntry } from '../types/flow-history.types';
import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-endpoints';

/**
 * Retrieves all flow history entries across all flows.
 * @returns {Promise<FlowHistoryEntry[]>} Promise resolving to an array of flow history entries.
 * @throws {Error} If the API request fails.
 */
export const getAllFlowHistory = async (): Promise<FlowHistoryEntry[]> => {
  try {
    return await apiClient.get<FlowHistoryEntry[]>(`${API_ENDPOINTS.flows.base}all-history`);
  } catch (error) {
    console.warn('Flow history endpoint failed:', error);
    throw error;
  }
};
