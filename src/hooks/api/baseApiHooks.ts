import {
  UseQueryOptions,
  UseMutationOptions
} from '@tanstack/react-query';
import { QueryKey } from '@tanstack/react-query';
import {
  useStandardQuery,
  useStandardDetailQuery,
  useStandardHistoryQuery,
  useStandardCreateMutation,
  useStandardUpdateMutation,
  useStandardDeleteMutation,
  DataPriority
} from '../query/queryUtils';

/**
 * Factory function to create standardized API hooks for any entity type
 * 
 * @template TEntity - The entity type (must have an id property)
 * @template TCreate - The create DTO type
 * @template TUpdate - The update DTO type
 * @param config - Configuration object for the hooks
 * @param config.queryKeys - Query key functions for React Query
 * @param config.queryKeys.all - Function to generate query key for all entities
 * @param config.queryKeys.detail - Function to generate query key for a single entity
 * @param config.queryKeys.history - Optional function to generate query key for entity history
 * @param config.services - Service functions for API operations
 * @param config.services.getAll - Function to fetch all entities
 * @param config.services.getById - Function to fetch a single entity
 * @param config.services.create - Optional function to create an entity
 * @param config.services.update - Optional function to update an entity
 * @param config.services.delete - Optional function to delete an entity
 * @param config.services.getHistory - Optional function to fetch entity history
 * @param config.priorities - Optional data priority settings for queries
 * @param config.priorities.list - Priority for list queries
 * @param config.priorities.detail - Priority for detail queries
 * @param config.priorities.history - Priority for history queries
 * @returns Object containing hooks for all CRUD operations
 */
export function createBaseApiHooks<
  TEntity extends { id: string },
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>
>(config: {
  queryKeys: {
    all: (teamId?: number | string) => QueryKey;
    detail: (id: string, teamId?: number | string) => QueryKey;
    history?: (id: string, params?: any) => QueryKey;
  };
  services: {
    getAll: (teamId?: number) => Promise<TEntity[]>;
    getById: (id: string, teamId?: number) => Promise<TEntity>;
    create?: (data: TCreate, teamId?: number) => Promise<TEntity>;
    update?: (id: string, data: TUpdate, teamId?: number) => Promise<TEntity>;
    delete?: (id: string, teamId?: number) => Promise<void>;
    getHistory?: (id: string, params?: any) => Promise<any[]>;
  };
  priorities?: {
    list?: DataPriority;
    detail?: DataPriority;
    history?: DataPriority;
  };
}) {
  // Set default priorities if not provided
  const priorities = {
    list: config.priorities?.list || DataPriority.MEDIUM,
    detail: config.priorities?.detail || DataPriority.MEDIUM, 
    history: config.priorities?.history || DataPriority.HIGH
  };

  return {
    /**
     * Hook to fetch all entities of a specific type
     * 
     * @param options - Optional React Query configuration options
     * @returns Query result containing entities data, loading state, and error state
     */
    useAll: (options?: UseQueryOptions<TEntity[]>) => {
      return useStandardQuery<TEntity[]>(
        config.queryKeys.all,
        config.services.getAll,
        priorities.list,
        options
      );
    },

    /**
     * Hook to fetch a single entity by ID
     * 
     * @param id - The unique identifier of the entity to fetch
     * @param options - Optional React Query configuration options
     * @returns Query result containing entity data, loading state, and error state
     */
    useOne: (id: string, options?: UseQueryOptions<TEntity>) => {
      return useStandardDetailQuery<TEntity>(
        config.queryKeys.detail,
        id,
        config.services.getById,
        priorities.detail,
        options
      );
    },

    /**
     * Hook to create a new entity
     * 
     * @param options - Optional React Query mutation options
     * @returns Mutation object with mutate function and state
     * @throws Error if create service function is not provided
     */
    useCreate: (
      options?: UseMutationOptions<TEntity, Error, TCreate>
    ) => {
      if (!config.services.create) {
        throw new Error('Create service function not provided');
      }
      
      return useStandardCreateMutation<TEntity, TCreate>(
        { all: config.queryKeys.all },
        config.services.create,
        options
      );
    },

    /**
     * Hook to update an existing entity
     * 
     * @param options - Optional React Query mutation options
     * @returns Mutation object with mutate function and state
     * @throws Error if update service function is not provided
     */
    useUpdate: (
      options?: UseMutationOptions<TEntity, Error, { id: string; updates: TUpdate }>
    ) => {
      if (!config.services.update) {
        throw new Error('Update service function not provided');
      }

      return useStandardUpdateMutation<TEntity, TUpdate>(
        { 
          all: config.queryKeys.all, 
          detail: config.queryKeys.detail,
          ...(config.queryKeys.history ? { history: config.queryKeys.history } : {})
        },
        config.services.update,
        options
      );
    },

    /**
     * Hook to delete an entity
     * 
     * @param options - Optional React Query mutation options
     * @returns Mutation object with mutate function and state
     * @throws Error if delete service function is not provided
     */
    useDelete: (
      options?: UseMutationOptions<void, Error, string>
    ) => {
      if (!config.services.delete) {
        throw new Error('Delete service function not provided');
      }

      return useStandardDeleteMutation<void>(
        { 
          all: config.queryKeys.all, 
          detail: config.queryKeys.detail,
          ...(config.queryKeys.history ? { history: config.queryKeys.history } : {})
        },
        config.services.delete,
        options
      );
    },

    /**
     * Hook to fetch entity history if applicable
     * 
     * @param id - The unique identifier of the entity to fetch history for
     * @param params - Optional parameters to filter or adjust history results
     * @param options - Optional React Query configuration options
     * @returns Query result containing history data, loading state, and error state
     * @throws Error if history service function or query key is not provided
     * @throws Error if entity ID is not provided
     */
    useHistory: (id: string, params?: any, options?: UseQueryOptions<any[]>) => {
      if (!config.services.getHistory || !config.queryKeys.history) {
        throw new Error('History service function or query key not provided');
      }

      if (!id) {
        throw new Error('Entity ID is required for history queries');
      }

      // Make sure the key function matches the expected signature
      const keyFunction = (id: string | undefined) => {
        if (!id) return [];
        return config.queryKeys.history!(id, params);
      };

      return useStandardHistoryQuery<any[]>(
        keyFunction,
        id,
        () => config.services.getHistory!(id, params),
        priorities.history,
        options
      );
    }
  };
}