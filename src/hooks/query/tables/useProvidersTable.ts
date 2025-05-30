import { Provider } from '@/types';
import { useProviders } from '@/hooks/api';
import { useTableData } from './useTableData';

/**
 * Custom hook to provide all provider table operations in a single place
 * This encapsulates the provider-related data fetching and mutations
 */
export function useProvidersTable() {

  // Get query hook - providers likely don't have mutations in this app
  const providersQuery = useProviders();

  // Use the standardized table data hook with our provider-specific operations
  return useTableData<Provider, any, any>({
    queryResult: providersQuery,
    mutations: {}, // No mutations for providers based on the API hooks available
    messages: {
      entityName: "provider",
    },
  });
}