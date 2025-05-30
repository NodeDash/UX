import { useEffect, useCallback, useState, useMemo } from 'react';
import { ReactFlowInstance, useNodesState } from '@xyflow/react';
import { AppNode } from '../../../components/nodes/types';
import { Flow } from '../../../types/flow.types';
import { HistoryData, createAllHistoryLookupMaps } from '../../../utils/flow-helpers';

/**
 * Hook to manage flow nodes and their creation/updates
 * 
 * @param flow - The flow object containing node definitions
 * @param flowInstance - Reference to the ReactFlow instance
 * @param historyData - Optional history data for entities in the flow
 * @returns Object containing node state and operations
 */
export function useFlowNodes(
  flow: Flow | undefined, 
  flowInstance: React.MutableRefObject<ReactFlowInstance<AppNode> | null>,
  historyData?: HistoryData
) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(flow?.nodes || []);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0); // Track last update time

  // Use directly provided history data or empty defaults, wrapped in useMemo to stabilize references
  const deviceHistory = useMemo(() => historyData?.deviceHistory || [], [historyData?.deviceHistory]);
  const functionHistoryData = useMemo(() => historyData?.allFunctionHistory || [], [historyData?.allFunctionHistory]);
  const integrationHistoryData = useMemo(() => historyData?.allIntegrationHistory || [], [historyData?.allIntegrationHistory]);
  const labelHistoryData = useMemo(() => historyData?.allLabelHistory || [], [historyData?.allLabelHistory]);

  // Create all lookup maps using the shared utility function
  const {
    deviceHistoryMap,
    functionHistoryMap,
    integrationHistoryMap,
    labelHistoryMap
  } = useMemo(() => createAllHistoryLookupMaps({
    deviceHistory,
    allFunctionHistory: functionHistoryData,
    allIntegrationHistory: integrationHistoryData,
    allLabelHistory: labelHistoryData
  }), [deviceHistory, functionHistoryData, integrationHistoryData, labelHistoryData]);
 
  // Load flow nodes when available
  useEffect(() => {
    if (flow?.nodes) {
      setNodes(flow.nodes);
    }
  }, [flow, setNodes]);

  /**
   * Gets the latest status for an entity based on its history
   * 
   * @param entityId - The ID of the entity to check
   * @param nodeType - The type of node/entity (device, function, integration, label)
   * @returns Status string representing the entity's last known state
   */
  const getLatestStatusForEntity = useCallback((entityId: string, nodeType: string) => {
    let historyEntries: any[] = [];
    const entId = String(entityId);

    // Determine which lookup map to check based on node type
    switch (nodeType) {
      case 'device':
        historyEntries = deviceHistoryMap[entId] || [];
        break;
      case 'function':
        historyEntries = functionHistoryMap[entId] || [];
        break;
      case 'integration':
        historyEntries = integrationHistoryMap[entId] || [];
        break;
      case 'label':
        historyEntries = labelHistoryMap[entId] || [];
        break;
      default:
        return 'no_history';
    }

    // If no entries found, return no history
    if (!historyEntries.length) return 'no_history';

    // If this is a device, we just want to check the length is more than 0
    if (nodeType === 'device') {
      return 'success';
    }
  
    // Get the latest entry (assuming entries are sorted by timestamp)
    const latestEntry = historyEntries[historyEntries.length - 1];
    return latestEntry ? latestEntry.status : 'no_history';
  }, [deviceHistoryMap, functionHistoryMap, integrationHistoryMap, labelHistoryMap]);

  // Memoize node status calculation to avoid expensive recalculations
  const nodeStatusUpdates = useMemo(() => {
    if (!nodes.length) return { hasChanges: false, updatedNodes: nodes };
    
    // Create a copy of nodes to modify
    const updatedNodes = nodes.map((node) => {
      const { entityId, nodeType } = node.data || {};
      
      // Skip nodes without entityId or nodeType
      if (!entityId || !nodeType) return node;
      
      // Get the latest status for this entity
      const status = getLatestStatusForEntity(entityId, nodeType);
      
      // Only update if status changed
      if (status !== node.data.status) {
        return {
          ...node,
          data: {
            ...node.data,
            status,
            lastUpdated: new Date().toISOString(), 
          },
        };
      }
      return node;
    });

    // Check if any node statuses changed
    const hasChanges = updatedNodes.some((updatedNode, index) => {
      const original = nodes[index];
      return updatedNode.data.status !== original.data.status;
    });

    return { hasChanges, updatedNodes };
  }, [nodes, getLatestStatusForEntity]);

  // Update node statuses based on latest history entries
  useEffect(() => {
    const { hasChanges, updatedNodes } = nodeStatusUpdates;
    
    // Only update if there were actual changes
    if (hasChanges) {
      setNodes(updatedNodes);
      setLastUpdateTime(Date.now()); 
    }
  }, [nodeStatusUpdates, setNodes]);

  /**
   * Creates a new node in the flow with the specified type and entity information
   * 
   * @param nodeType - The type of node to create
   * @param entityId - Optional ID of an existing entity to associate with this node
   * @param entityName - Optional display name for the node
   */
  const createNode = useCallback(
    (nodeType: 'device' | 'function' | 'integration' | 'position-logger' | 'storage' | 'action' | 'label', entityId?: string, entityName?: string) => {
      const position = flowInstance.current
        ? flowInstance.current.screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          })
        : { x: 100, y: 100 };
      
      // Parse entityId to ensure it's treated as a number if it's numeric
      const parsedEntityId = entityId && !isNaN(Number(entityId)) ? Number(entityId) : entityId;
      
      // Get initial status for the entity if it exists
      const status = parsedEntityId ? getLatestStatusForEntity(String(parsedEntityId), nodeType) : 'no_history';

      const newNode: AppNode = {
        id: `${nodeType}-${Date.now()}`, // This is just the node's UI identifier
        type: nodeType,
        position,
        data: {
          label:
            entityName ||
            `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} ${
              nodes.length + 1
            }`,
          nodeType,
          entityId: parsedEntityId ? String(parsedEntityId) : undefined, // Ensure entityId is always a string or undefined
          status,
          lastUpdated: new Date().toISOString(),
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [flowInstance, nodes.length, setNodes, getLatestStatusForEntity]
  );

  /**
   * Gets a list of entity IDs already used in the flow for a specific node type
   * 
   * @param nodeType - The type of nodes to filter by
   * @returns Array of entity IDs currently used in the flow
   */
  const getExistingEntityIds = useCallback((nodeType: 'device' | 'function' | 'integration' | 'position-logger' | 'storage' | 'action' | 'label' ): string[] => {
    return nodes
      .filter((node) => node.data.nodeType === nodeType && node.data.entityId)
      .map((node) => node.data.entityId as string);
  }, [nodes]);

  return {
    nodes,
    setNodes,
    onNodesChange,
    createNode,
    getExistingEntityIds,
    lastUpdateTime // Return this for potential external use
  };
}