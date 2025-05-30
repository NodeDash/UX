import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-endpoints';
import { DeviceHistory } from '@/types';

/**
 * Fetches history for a specific device.
 * @param {string} deviceId - The ID of the device to get history for.
 * @param {number} [teamId] - Optional team ID to filter by team context.
 * @returns {Promise<DeviceHistory[]>} Promise resolving to an array of device history records.
 */
export const getDeviceHistory = (deviceId: string, teamId?: number): Promise<DeviceHistory[]> => {
  const params = teamId ? { team_id: teamId } : undefined;
  return apiClient.get(API_ENDPOINTS.devices.history(deviceId), { params });
};

/**
 * Fetches history for all devices.
 * @param {number} [teamId] - Optional team ID to filter by team context.
 * @returns {Promise<DeviceHistory[]>} Promise resolving to an array of all device history records.
 */
export const getAllDeviceHistory = (teamId?: number): Promise<DeviceHistory[]> => {
  const params = teamId ? { team_id: teamId } : undefined;
  return apiClient.get(API_ENDPOINTS.deviceHistory.all, { params });
};