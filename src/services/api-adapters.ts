import { Device } from '@/types';

/**
 * Adapters to convert between API models (snake_case) and client models (camelCase)
 */

/**
 * API Device model as defined in OpenAPI spec
 */
export interface ApiDevice {
  /** Unique identifier for the device */
  id: number;
  /** Display name of the device */
  name: string;
  /** Device unique identifier (DevEUI) */
  dev_eui: string;
  /** Application unique identifier (AppEUI) */
  app_eui: string;
  /** Application key */
  app_key: string;
  /** Region configuration for the device */
  region: 'EU868' | 'US915' | 'AU915' | 'AS923';
  /** Whether the device is in Class C mode */
  is_class_c: boolean;
  /** Current status of the device */
  status?: 'online' | 'offline' | 'maintenance';
  /** Associated label identifiers */
  label_ids?: number[];
  /** Expected transmission time in minutes */
  expected_transmit_time?: number;
  /** Creation timestamp */
  created_at: string;
  /** Last update timestamp */
  updated_at: string;
}

/**
 * Converts an API device object to the client device format.
 * @param {ApiDevice} apiDevice - Device object from the API.
 * @returns {Device} Device object in client format.
 */
export function apiDeviceToClientDevice(apiDevice: ApiDevice): Device {
  // Handle expected_transmit_time conversion with fallback
  let transmitTime = 60; // Default to 60 minutes
  
  if (apiDevice.expected_transmit_time !== undefined && apiDevice.expected_transmit_time !== null) {
    const parsed = Number(apiDevice.expected_transmit_time);
    if (!isNaN(parsed)) {
      transmitTime = parsed;
    }
  }

  return {
    id: apiDevice.id.toString(),
    name: apiDevice.name,
    dev_eui: apiDevice.dev_eui,
    app_eui: apiDevice.app_eui,
    app_key: apiDevice.app_key,
    region: apiDevice.region,
    is_class_c: apiDevice.is_class_c,
    status: apiDevice.status || 'offline',
    label_ids: apiDevice.label_ids?.map(id => id) || [],
    expected_transmit_time: transmitTime,
    lastSeen: apiDevice.updated_at, // Use updated_at as lastSeen if no specific field
    created_at: apiDevice.created_at,
    updated_at: apiDevice.updated_at
  };
}

/**
 * Converts a client device object to the API device format.
 * @param {Partial<Device>} device - Device object from the client.
 * @returns {Record<string, unknown>} Device object in API format.
 */
export function clientDeviceToApiDevice(device: Partial<Device>): Record<string, unknown> {
  const apiDevice: Record<string, unknown> = {};
  
  // Include required fields
  if (device.name !== undefined) apiDevice.name = device.name;
  if (device.dev_eui !== undefined) apiDevice.dev_eui = device.dev_eui;
  if (device.app_eui !== undefined) apiDevice.app_eui = device.app_eui;
  if (device.app_key !== undefined) apiDevice.app_key = device.app_key;
  if (device.region !== undefined) apiDevice.region = device.region;
  if (device.is_class_c !== undefined) apiDevice.is_class_c = device.is_class_c;
  if (device.status !== undefined) apiDevice.status = device.status;
  if (device.expected_transmit_time !== undefined) apiDevice.expected_transmit_time = device.expected_transmit_time;
  
  // Convert label_ids from string to number if needed by the API
  if (device.label_ids !== undefined) {
    apiDevice.label_ids = device.label_ids.map(id => 
      typeof id === 'string' ? parseInt(id, 10) : id
    );
  }
  
  return apiDevice;
}


