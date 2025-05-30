import { 
  DeviceWithLabels, 
  Flow, 
  Function as FlowFunction, 
  Integration, 
  Label 
} from '@/types';

/**
 * Represents a search result item.
 */
export interface SearchResult {
  /** Unique identifier of the item */
  id: string;
  /** Display name of the item */
  name: string;
  /** Type of the entity (device, flow, function, etc.) */
  type: string;
  /** Navigation path to the item */
  path: string;
  
}

/**
 * Data structure containing entities that can be searched.
 */
interface SearchableData {
    /** Devices with their associated labels */
    devices: DeviceWithLabels[];
    /** Flow definitions */
    flows: Flow[];
    /** Function definitions */
    functions: FlowFunction[];
    /** Integration definitions */
    integrations: Integration[];
    /** Label definitions */
    labels: Label[];
}

/**
 * Service for handling search functionality across different entity types.
 */
class SearchService {
    /**
     * Searches across provided data for matches to the query.
     * @param {string} query - The search query.
     * @param {SearchableData} data - The data to search through.
     * @returns {Promise<SearchResult[]>} Promise resolving to an array of search results.
     */
    async search(query: string, data: SearchableData): Promise<SearchResult[]> {
        const lowerCaseQuery = query.toLowerCase();
        const results: SearchResult[] = [];

        // Search devices
        data.devices.forEach(device => {
            if (device.name.toLowerCase().includes(lowerCaseQuery) || device.dev_eui.toLowerCase().includes(lowerCaseQuery)) {
                results.push({ id: device.id, name: device.name, type: 'device', path: `/devices/${device.id}` });
            }
        });

        // Search flows
        data.flows.forEach(flow => {
            if (flow.name.toLowerCase().includes(lowerCaseQuery)) {
                results.push({ id: flow.id, name: flow.name, type: 'flow', path: `/flows/${flow.id}` });
            }
        });

        // Search functions
        data.functions.forEach(func => {
            if (func.name.toLowerCase().includes(lowerCaseQuery)) {
                results.push({ id: func.id, name: func.name, type: 'function', path: `/functions#${func.id}` });            
            }
        });

        // Search integrations
        data.integrations.forEach(integration => {
            if (integration.name.toLowerCase().includes(lowerCaseQuery)) {
                results.push({ 
                    id: integration.id, 
                    name: integration.name, 
                    type: 'integration', 
                    path: `/integrations#${integration.id}` 
                });
            }
        });

        // Search labels
        data.labels.forEach(label => {
            if (label.name.toLowerCase().includes(lowerCaseQuery)) {
                results.push({ 
                    id: label.id, 
                    name: label.name, 
                    type: 'label', 
                    path: `/labels#${label.id}` 
                });
            }
        });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return results;
    }

    /**
     * Searches through API for matches to the query.
     * @param {string} query - The search query.
     * @param {string} teamId - Team ID to restrict search context.
     * @returns {Promise<SearchResult[]>} Promise resolving to an array of search results.
     */
    async searchApi(query: string, teamId: string): Promise<SearchResult[]> {
        console.log("API Search called with:", query, "Team ID:", teamId);
        // Replace with actual API call using apiClient
        // const results = await apiClient.get('/search', { params: { q: query, teamId } });
        // return results; // Adapt response if necessary
        return []; // Placeholder
    }
}

/**
 * Instance of the SearchService for application use.
 */
export const searchService = new SearchService();