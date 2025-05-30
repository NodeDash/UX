/**
 * Centralized query key definitions
 * 
 * This file defines all query keys used in the application to ensure consistency
 * and avoid typos/duplications across the codebase.
 */

/**
 * Helper function to construct a team-aware query key
 */
const withTeam = (key: string, teamId?: number | string) => [key, teamId ?? 'user'];

/**
 * Type definitions for query keys to improve type safety
 */
export type QueryKeyFunction<T extends any[] = []> = (...args: T) => readonly unknown[];

/**
 * All application query keys organized by domain/entity
 */
export const queryKeys = {
  devices: {
    all: (teamId?: number | string) => [...withTeam('devices', teamId), 'all'] as const,
    detail: (id: string, teamId?: number | string) => [...withTeam('devices', teamId), id] as const,
    history: (deviceId: string) => ['device-history', deviceId] as const
  },
  flows: {
    all: (teamId?: number | string) => [...withTeam('flows', teamId), 'all'] as const,
    detail: (id: string, teamId?: number | string) => [...withTeam('flows', teamId), id] as const,
    history: (flowId: string) => ['flow-history', flowId] as const
  },
  functions: {
    all: (teamId?: number | string) => [...withTeam('functions', teamId), 'all'] as const,
    detail: (id: string, teamId?: number | string) => [...withTeam('functions', teamId), id] as const,
    history: (functionId: string) => ['function-history', functionId] as const
  },
  integrations: {
    all: (teamId?: number | string) => [...withTeam('integrations', teamId), 'all'] as const,
    detail: (id: string, teamId?: number | string) => [...withTeam('integrations', teamId), id] as const,
    history: (integrationId: string, flowId?: string, teamId?: number | string) => 
      ['integration-history', teamId ?? 'user', integrationId, flowId ?? 'all'] as const
  },
  labels: {
    all: (teamId?: number | string) => [...withTeam('labels', teamId), 'all'] as const,
    detail: (id: string, teamId?: number | string) => [...withTeam('labels', teamId), id] as const,
    history: (labelId: string, flowId?: string, teamId?: number | string) => 
      ['label-history', teamId ?? 'user', labelId, flowId ?? 'all'] as const
  },
  providers: {
    all: (teamId?: number | string) => [...withTeam('providers', teamId), 'all'] as const,
    detail: (id: string, teamId?: number | string) => [...withTeam('providers', teamId), id] as const
  },
  teams: {
    all: () => ['teams'] as const,
    detail: (teamId: string | number) => ['team', teamId] as const,
    users: (teamId: string | number) => ['team-users', teamId] as const
  },
  dashboard: {
    summary: (teamId?: number | string) => [...withTeam('dashboard', teamId), 'summary'] as const,
    alerts: (teamId?: number | string) => [...withTeam('dashboard', teamId), 'alerts'] as const,
    stats: (teamId?: number | string) => [...withTeam('dashboard', teamId), 'stats'] as const
  },
  user: {
    profile: () => ['user-profile'] as const,
    preferences: () => ['user-preferences'] as const
  }
};