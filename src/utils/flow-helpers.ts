/**
 * Utility functions for flow visualization components
 */

/**
 * Creates a lookup map from history data for faster entity access
 * 
 * @param historyData Array of history entries
 * @param idFieldNames Possible field names for the entity ID in history entries
 * @returns A map of entity IDs to their history entries
 */
export function createHistoryLookupMap<T extends Record<string, any>>(
  historyData: T[],
  idFieldNames: string[]
): Record<string, T[]> {
  return historyData.reduce((acc: Record<string, T[]>, entry: T) => {
    // Try each possible ID field name until one is found
    let entityId: string | undefined;
    for (const fieldName of idFieldNames) {
      if (entry[fieldName]) {
        entityId = String(entry[fieldName]);
        break;
      }
    }
    
    if (!entityId) return acc;
    
    if (!acc[entityId]) {
      acc[entityId] = [];
    }
    acc[entityId].push(entry);
    return acc;
  }, {});
}

/**
 * Standard history data interface used across flow hooks
 */
export interface HistoryData {
  deviceHistory?: any[];
  allFunctionHistory?: any[];
  allIntegrationHistory?: any[];
  allLabelHistory?: any[];
}

/**
 * Creates all entity history lookup maps used in flow visualization
 * 
 * @param historyData Object containing all history arrays
 * @returns Object with lookup maps for each entity type
 */
export function createAllHistoryLookupMaps(historyData: HistoryData) {
  return {
    deviceHistoryMap: createHistoryLookupMap(
      historyData?.deviceHistory || [],
      ['device_id', 'deviceId']
    ),
    functionHistoryMap: createHistoryLookupMap(
      historyData?.allFunctionHistory || [],
      ['function_id', 'functionId']
    ),
    integrationHistoryMap: createHistoryLookupMap(
      historyData?.allIntegrationHistory || [],
      ['integration_id', 'integrationId']
    ),
    labelHistoryMap: createHistoryLookupMap(
      historyData?.allLabelHistory || [],
      ['label_id', 'labelId']
    )
  };
}