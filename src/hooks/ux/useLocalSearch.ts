import { useState, useEffect, useMemo } from 'react';
import { searchService, SearchResult } from '../../services/search.service';
import { useDevices, useFlows, useFunctions, useIntegrations, useLabels } from '../api';

/**
 * A hook for searching across multiple entity types using local data from React Query cache
 * 
 * @param query - The search query string to filter entities by
 * @returns {Object} Object containing search results and loading state
 * @returns {SearchResult[]} returns.results - Array of search results matching the query
 * @returns {boolean} returns.isLoading - Whether any of the data sources are still loading
 */
export const useLocalSearch = (query: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  
  // Use our existing hooks to get the data
  const { data: devices = [], isLoading: devicesLoading } = useDevices();
  const { data: flows = [], isLoading: flowsLoading } = useFlows();
  const { data: functions = [], isLoading: functionsLoading } = useFunctions();
  const { data: integrations = [], isLoading: integrationsLoading } = useIntegrations();
  const { data: labels = [], isLoading: labelsLoading } = useLabels();

  // Combine loading states
  const isLoading = devicesLoading || flowsLoading || functionsLoading || integrationsLoading || labelsLoading;
  
  /**
   * Memoize entities to avoid unnecessary reprocessing on each render
   */
  const entities = useMemo(() => ({
    devices,
    flows,
    functions,
    integrations,
    labels
  }), [devices, flows, functions, integrations, labels]);

  /**
   * Perform local search using debouncing to avoid excessive processing
   * Only searches when query is at least 2 characters and data is loaded
   */
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    // Don't search while data is still loading
    if (isLoading) return;
    
    const searchTimeout = setTimeout(async () => {
      const searchResults = await searchService.search(query, entities);
      setResults(searchResults);
    }, 300); // 300ms debounce

    return () => clearTimeout(searchTimeout);
  }, [query, entities, isLoading]);

  return { results, isLoading };
};