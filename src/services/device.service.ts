import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-endpoints';
import {
  Device,
  DeviceCreate,
  DeviceUpdate,
  DeviceHistory,
  DeviceWithLabels,
} from '@/types';

/**
 * Service for handling device-related API calls.
 */
export const deviceService = {
  /**
   * Fetches all devices with their associated labels.
   * @param {number} [teamId] - Optional team ID to filter devices by team.
   * @returns {Promise<DeviceWithLabels[]>} Promise resolving to an array of devices with labels.
   */
  getDevices: (teamId?: number): Promise<DeviceWithLabels[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.devices.base, { params });
  },

  /**
   * Fetches a specific device by its ID.
   * @param {string} id - The ID of the device to retrieve.
   * @param {number} [teamId] - Optional team ID to filter by team context.
   * @returns {Promise<DeviceWithLabels>} Promise resolving to the device with labels.
   */
  getDeviceById: (id: string, teamId?: number): Promise<DeviceWithLabels> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.get(API_ENDPOINTS.devices.get(id), { params });
  },

  /**
   * Creates a new device.
   * @param {DeviceCreate} data - The data for the new device.
   * @param {number} [teamId] - Optional team ID for the device context.
   * @returns {Promise<Device>} Promise resolving to the created device.
   */
  createDevice: (data: DeviceCreate, teamId?: number): Promise<Device> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.post(API_ENDPOINTS.devices.base, data, { params });
  },

  /**
   * Updates an existing device.
   * @param {string} id - The ID of the device to update.
   * @param {DeviceUpdate} data - The updated data.
   * @param {number} [teamId] - Optional team ID for the device context.
   * @returns {Promise<Device>} Promise resolving to the updated device.
   */
  updateDevice: (
    id: string,
    data: DeviceUpdate,
    teamId?: number
  ): Promise<Device> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.put(API_ENDPOINTS.devices.update(id), data, { params });
  },

  /**
   * Deletes a device by ID.
   * @param {string} id - The ID of the device to delete.
   * @param {number} [teamId] - Optional team ID for the device context.
   * @returns {Promise<void>} Promise resolving when deletion is successful.
   */
  deleteDevice: (id: string, teamId?: number): Promise<void> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.delete(API_ENDPOINTS.devices.delete(id), { params });
  },

  /**
   * Retrieves history for a specific device.
   * @param {string} deviceId - The ID of the device to get history for.
   * @param {number} [teamId] - Optional team ID for the device context.
   * @returns {Promise<DeviceHistory[]>} Promise resolving to an array of device history records.
   */
  getDeviceHistory: (
    deviceId: string,
    teamId?: number
  ): Promise<DeviceHistory[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient
      .get(API_ENDPOINTS.devices.history(deviceId), { params })
  },

  /**
   * Retrieves history for all devices.
   * @param {number} [teamId] - Optional team ID to filter by team context.
   * @returns {Promise<DeviceHistory[]>} Promise resolving to an array of all device history records.
   */
  getAllDeviceHistory: (teamId?: number): Promise<DeviceHistory[]> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient
      .get(API_ENDPOINTS.deviceHistory.all, { params })
  },

  /**
   * Associates a label with a device.
   * @param {string} deviceId - The ID of the device.
   * @param {string} labelId - The ID of the label to add.
   * @param {number} [teamId] - Optional team ID for the device context.
   * @returns {Promise<void>} Promise resolving when the label is added.
   */
  addLabelToDevice: (
    deviceId: string,
    labelId: string,
    teamId?: number
  ): Promise<void> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.post(
      API_ENDPOINTS.labels.device(labelId, deviceId),
      { deviceId },
      { params }
    );
  },

  /**
   * Removes a label from a device.
   * @param {string} deviceId - The ID of the device.
   * @param {string} labelId - The ID of the label to remove.
   * @param {number} [teamId] - Optional team ID for the device context.
   * @returns {Promise<void>} Promise resolving when the label is removed.
   */
  removeLabelFromDevice: (
    deviceId: string,
    labelId: string,
    teamId?: number
  ): Promise<void> => {
    const params = teamId ? { team_id: teamId } : undefined;
    return apiClient.delete(
      API_ENDPOINTS.labels.removeDevice(labelId, deviceId),
      { params }
    );
  },
};