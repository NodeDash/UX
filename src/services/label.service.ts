import { apiClient } from './api-client'; 
import { API_ENDPOINTS } from './api-endpoints';
import { Label, LabelCreate, LabelUpdate, Device } from '@/types';

/**
 * Service for handling label-related API calls.
 */
export const labelService = {
  /**
   * Fetches all labels.
   * @param {number} [teamId] - Optional team ID to filter labels by team.
   * @returns {Promise<Label[]>} Promise resolving to an array of labels.
   */
  getLabels: (teamId?: number): Promise<Label[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.labels.base, { params });
  },

  /**
   * Fetches a specific label by its ID.
   * @param {string} id - The ID of the label to retrieve.
   * @param {number} [teamId] - Optional team ID to filter by team context.
   * @returns {Promise<Label>} Promise resolving to the label.
   */
  getLabelById: (id: string, teamId?: number): Promise<Label> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.labels.get(id), { params });
  },

  /**
   * Creates a new label.
   * @param {LabelCreate} data - The data for the new label.
   * @param {number} [teamId] - Optional team ID for the label context.
   * @returns {Promise<Label>} Promise resolving to the created label.
   */
  createLabel: (data: LabelCreate, teamId?: number): Promise<Label> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.post(API_ENDPOINTS.labels.base, data, { params });
  },

  /**
   * Updates an existing label.
   * @param {string} id - The ID of the label to update.
   * @param {LabelUpdate} data - The updated data.
   * @param {number} [teamId] - Optional team ID for the label context.
   * @returns {Promise<Label>} Promise resolving to the updated label.
   */
  updateLabel: (id: string, data: LabelUpdate, teamId?: number): Promise<Label> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.put(API_ENDPOINTS.labels.update(id), data, { params });
  },

  /**
   * Deletes a label by ID.
   * @param {string} id - The ID of the label to delete.
   * @param {number} [teamId] - Optional team ID for the label context.
   * @returns {Promise<void>} Promise resolving when deletion is successful.
   */
  deleteLabel: (id: string, teamId?: number): Promise<void> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.delete(API_ENDPOINTS.labels.delete(id), { params });
  },

  /**
   * Fetches all devices associated with a specific label.
   * @param {string} labelId - The ID of the label to get devices for.
   * @param {number} [teamId] - Optional team ID to filter by team context.
   * @returns {Promise<Device[]>} Promise resolving to an array of devices.
   */
  getDevicesByLabel: (labelId: string, teamId?: number): Promise<Device[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.labels.devices(labelId), { params });
  },

  /**
   * Associates a device with a label.
   * @param {string} labelId - The ID of the label.
   * @param {string} deviceId - The ID of the device to add to the label.
   * @param {number} [teamId] - Optional team ID for the label context.
   * @returns {Promise<void>} Promise resolving when the device is added.
   */
  addDeviceToLabel: (
    labelId: string,
    deviceId: string,
    teamId?: number
  ): Promise<void> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.post(
      API_ENDPOINTS.labels.addDevice(labelId),
      { device_id: deviceId },      
      { params }
    );
  },

  /**
   * Removes a device from a label.
   * @param {string} labelId - The ID of the label.
   * @param {string} deviceId - The ID of the device to remove from the label.
   * @param {number} [teamId] - Optional team ID for the label context.
   * @returns {Promise<void>} Promise resolving when the device is removed.
   */
  removeDeviceFromLabel: (
    labelId: string,
    deviceId: string,
    teamId?: number
  ): Promise<void> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.delete(
      API_ENDPOINTS.labels.removeDevice(labelId, deviceId),
      { params }
    );
  },

  /**
   * Retrieves history for a specific label.
   * @param {string} labelId - The ID of the label to get history for.
   * @param {number} [teamId] - Optional team ID for the label context.
   * @returns {Promise<any[]>} Promise resolving to an array of label history records.
   */
  getLabelHistory: (labelId: string, teamId?: number): Promise<any[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.labels.history(labelId), { params });
  },

  /**
   * Retrieves history for all labels.
   * @param {number} [teamId] - Optional team ID to filter by team context.
   * @returns {Promise<any[]>} Promise resolving to an array of all label history records.
   */
  getAllLabelHistory: (teamId?: number): Promise<any[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.labels.allHistory, { params });
  },
};