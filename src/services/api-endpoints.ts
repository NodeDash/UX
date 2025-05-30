/**
 * API endpoints definition based on the OpenAPI specification
 */

export const API_ENDPOINTS = {
  // Device endpoints
  devices: {
    base: '/api/v1/devices/',
    get: (id: string) => `/api/v1/devices/${id}`,
    update: (id: string) => `/api/v1/devices/${id}`,
    delete: (id: string) => `/api/v1/devices/${id}`,
    labels: (deviceId: string) => `/api/v1/devices/${deviceId}/labels`,
    history: (id: string) => `/api/v1/devices/${id}/history`
  },

  // Dashboard endpoints
  dashboard: {
    stats: '/api/v1/dashboard/stats'
  },

  // Label endpoints
  labels: {
    base: '/api/v1/labels/',
    get: (id: string) => `/api/v1/labels/${id}`,
    update: (id: string) => `/api/v1/labels/${id}`,
    delete: (id: string) => `/api/v1/labels/${id}`,
    devices: (labelId: string) => `/api/v1/labels/${labelId}/devices`,
    device: (labelId: string, deviceId: string) => `/api/v1/labels/${labelId}/devices/${deviceId}`,
    addDevice: (labelId: string) => `/api/v1/labels/${labelId}/devices`,
    removeDevice: (labelId: string, deviceId: string) => `/api/v1/labels/${labelId}/devices/${deviceId}`,
    history: (id: string) => `/api/v1/labels/${id}/history`,
    allHistory: '/api/v1/labels/all-history'
  },

  // Integration endpoints
  integrations: {
    base: '/api/v1/integrations/',
    get: (id: string) => `/api/v1/integrations/${id}`,
    update: (id: string) => `/api/v1/integrations/${id}`,
    delete: (id: string) => `/api/v1/integrations/${id}`,
    history: (id: string) => `/api/v1/integrations/${id}/history`,
    allHistory: '/api/v1/integrations/all-history',
  },

  // Provider endpoints
  providers: {
    base: '/api/v1/providers/',
    get: (id: number) => `/api/v1/providers/${id}`,
    update: (id: number) => `/api/v1/providers/${id}`,
    delete: (id: number) => `/api/v1/providers/${id}`,
  },

  // Function endpoints
  functions: {
    base: '/api/v1/functions/',
    get: (id: string) => `/api/v1/functions/${id}`,
    update: (id: string) => `/api/v1/functions/${id}`,
    delete: (id: string) => `/api/v1/functions/${id}`,
    history: (id: string) => `/api/v1/functions/${id}/history`,
    allHistory: '/api/v1/functions/all-history',
  },

  functionHistory: {
    list: '/api/v1/functions/history',
    byFunction: (functionId: string) => `/api/v1/functions/${functionId}/history`,
    byId: (historyId: string) => `/api/v1/functions/history/${historyId}`,
    stats: '/api/v1/functions/history'
  },

  // Flow endpoints
  flows: {
    base: '/api/v1/flows/',
    get: (id: string) => `/api/v1/flows/${id}`,
    update: (id: string) => `/api/v1/flows/${id}`,
    delete: (id: string) => `/api/v1/flows/${id}`,
    layout: (id: string) => `/api/v1/flows/${id}/layout`,
    history: (id: string) => `/api/v1/flows/${id}/history`,
    allHistory: '/api/v1/flows/all-history',
  },

  // Storage endpoints
  storages: {
    base: '/api/v1/storage/',
    get: (id: string) => `/api/v1/storage/${id}`,
    update: (id: string) => `/api/v1/storage/${id}`,
    delete: (id: string) => `/api/v1/storage/${id}`,
    test: (id: string) => `/api/v1/storage/${id}/test`
  },

  // Alert endpoints
  alerts: {
    base: '/api/v1/alerts/',
    get: (id: string) => `/api/v1/alerts/${id}`,
    update: (id: string) => `/api/v1/alerts/${id}`,
    delete: (id: string) => `/api/v1/alerts/${id}`
  },

  // Team endpoints
  teams: {
    base: '/api/v1/teams/',
    get: (id: number) => `/api/v1/teams/${id}`,
    update: (id: number) => `/api/v1/teams/${id}`,
    delete: (id: number) => `/api/v1/teams/${id}`,
    addMember: (teamId: number, userEmail: string) => `/api/v1/teams/${teamId}/members/${userEmail}`,
    removeMember: (teamId: number, userId: number) => `/api/v1/teams/${teamId}/members/${userId}`
  },

  // Ingest endpoints
  ingest: {
    chirpstack: '/api/v1/ingest/chirpstack'
  },

  // Device history endpoints
  deviceHistory: {
    base: '/api/v1/devices/history',
    all: '/api/v1/devices/history',
    device: (id: string) => `/api/v1/devices/${id}/history`,
    get: (id: string) => `/device-history/${id}`
  },

  // Search endpoints
  search: {
    base: '/search'
  },

  // Utility endpoints
  root: '/',
  health: '/health'
};
