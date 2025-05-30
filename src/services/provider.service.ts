import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-endpoints';
import { 
  Provider, 
  CreateProviderDto, 
  UpdateProviderDto, 
} from '../types/provider.types';

/**
 * Service for managing providers
 */
export const providerService = {
  /**
   * Get a list of providers with optional filtering
   * @param teamId Optional team ID for team-scoped providers
   * @returns List of providers
   */
  getAll: (teamId?: number): Promise<Provider[]> => {
    const queryParams = {
      ...(teamId ? { team_id: teamId } : {})
    };
    
    return apiClient.get<Provider[]>(
      API_ENDPOINTS.providers.base,
      { params: queryParams }
    );
  },

  /**
   * Get a single provider by ID
   * @param id Provider ID
   * @param teamId Optional team ID for team-scoped providers
   * @returns Provider details
   */
  getById: (id: string, teamId?: number): Promise<Provider> => {
    const params = teamId ? { team_id: teamId } : undefined;
    
    return apiClient.get<Provider>(
      API_ENDPOINTS.providers.get(Number(id)),
      { params }
    );
  },

  /**
   * Create a new provider
   * @param data Provider data
   * @param teamId Optional team ID for team-scoped providers
   * @returns Created provider
   */
  create: (data: CreateProviderDto, teamId?: number): Promise<Provider> => {
    const params = teamId ? { team_id: teamId } : undefined;
    
    return apiClient.post<Provider>(
      API_ENDPOINTS.providers.base,
      data as unknown as Record<string, unknown>,
      { params }
    );
  },

  /**
   * Update an existing provider
   * @param id Provider ID
   * @param data Provider data to update
   * @param teamId Optional team ID for team-scoped providers
   * @returns Updated provider
   */
  update: (id: string, data: UpdateProviderDto, teamId?: number): Promise<Provider> => {
    const params = teamId ? { team_id: teamId } : undefined;
    
    return apiClient.put<Provider>(
      API_ENDPOINTS.providers.update(Number(id)),
      data as unknown as Record<string, unknown>,
      { params }
    );
  },

  /**
   * Delete a provider
   * @param id Provider ID
   * @param teamId Optional team ID for team-scoped providers
   * @returns Delete confirmation
   */
  delete: (id: string, teamId?: number): Promise<null> => {
    const params = teamId ? { team_id: teamId } : undefined;
    
    return apiClient.delete<null>(
      API_ENDPOINTS.providers.delete(Number(id)),
      { params }
    );
  },

  /**
   * Toggle a provider's active status
   * @param id Provider ID
   * @param active Active status to set
   * @param teamId Optional team ID for team-scoped providers
   * @returns Updated provider
   */
  toggleActive: (id: string, active: boolean, teamId?: number): Promise<Provider> => {
    return providerService.update(id, { is_active: active }, teamId);
  }
};