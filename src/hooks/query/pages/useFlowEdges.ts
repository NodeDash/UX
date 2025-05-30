import { useEffect, useCallback, useMemo } from 'react';
import { 
  useEdgesState, 
  addEdge,
  Connection,
  Edge as ReactFlowEdge
} from '@xyflow/react';
import { AppNode } from '../../../components/nodes/types';
import { Flow } from '../../../types/flow.types';
import { Edge } from '@xyflow/react';
import { HistoryData, createAllHistoryLookupMaps } from '../../../utils/flow-helpers';

/**
 * Hook to manage flow edges and their creation/updates
 * 
 * @param flow - The flow object containing edge definitions
 * @param nodes - Array of nodes in the current flow
 * @param historyData - Optional history data for entities in the flow
 * @returns Object containing edge state and operations
 */
export function useFlowEdges(
  flow: Flow | undefined,
  nodes: AppNode[],
  historyData?: HistoryData
) {
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(flow?.edges || []);
  
  // Use provided history data or empty defaults with useMemo to stabilize references
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

  // Load flow edges when available
  useEffect(() => {
    if (flow?.edges) {
      setEdges(flow.edges);
    }
  }, [flow, setEdges]);

  // Memoize the 24-hour cutoff date for recent activity checks
  const twentyFourHoursAgo = useMemo(() => {
    const date = new Date();
    date.setHours(date.getHours() - 24);
    return date;
  }, []);

  /**
   * Determines if an entity has recent activity within the last 24 hours
   * 
   * @param entityId - The ID of the entity to check
   * @param nodeType - The type of entity (device, function, integration, label)
   * @returns True if the entity has had activity in the last 24 hours
   */
  const hasRecentActivity = useCallback((entityId?: string, nodeType?: string): boolean => {
    if (!entityId || !nodeType) return false;
    
    let historyEntries: any[] = [];
    const entId = String(entityId);
    
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
        return false;
    }

    if (!historyEntries.length) return false;

    const recentEntries = historyEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= twentyFourHoursAgo;
    });

    if (!recentEntries.length) return false;

    if (nodeType === 'device') {
      return true;
    }

    const latestEntry = recentEntries[recentEntries.length - 1];
    return latestEntry?.status === 'success';
  }, [deviceHistoryMap, functionHistoryMap, integrationHistoryMap, labelHistoryMap, twentyFourHoursAgo]);

  // Store node map for faster lookups
  const nodeMap = useMemo(() => {
    return nodes.reduce<Record<string, AppNode>>((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  }, [nodes]);

  /**
   * Handles new connections between nodes
   * 
   * @param connection - The connection data from ReactFlow
   */
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const sourceNode = nodeMap[connection.source];
        const targetNode = nodeMap[connection.target];
        
        if (!sourceNode || !targetNode) return;
        
        const sourceEntityId = sourceNode.data?.entityId;
        const sourceNodeType = sourceNode.data?.nodeType;
        
        const targetEntityId = targetNode.data?.entityId;
        const targetNodeType = targetNode.data?.nodeType;

        const recentActivity = 
          hasRecentActivity(sourceEntityId, sourceNodeType) ||
          hasRecentActivity(targetEntityId, targetNodeType);

        const edge: ReactFlowEdge = {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle || undefined,
          targetHandle: connection.targetHandle || undefined,
          animated: recentActivity,
        };
        setEdges((eds) => addEdge(edge, eds));
      }
    },
    [setEdges, nodeMap, hasRecentActivity]
  );

  // Memoize edge updates to reduce unnecessary state changes
  const edgeUpdates = useMemo(() => {
    if (!edges.length || !nodes.length) return { hasChanges: false, updatedEdges: edges };

    let hasChanges = false;
    const updatedEdges = edges.map((edge) => {
      const sourceNode = nodeMap[edge.source];
      const targetNode = nodeMap[edge.target];
      
      if (!sourceNode?.data || !targetNode?.data) return edge;
      
      const sourceEntityId = sourceNode.data.entityId;
      const sourceNodeType = sourceNode.data.nodeType;
      
      const targetEntityId = targetNode.data.entityId;
      const targetNodeType = targetNode.data.nodeType;

      const hasRecent = 
        hasRecentActivity(sourceEntityId, sourceNodeType) || 
        hasRecentActivity(targetEntityId, targetNodeType);

      if (edge.animated !== hasRecent) {
        hasChanges = true;
        return {
          ...edge,
          animated: hasRecent,
        };
      }
      
      return edge;
    });

    return { hasChanges, updatedEdges };
  }, [edges, nodeMap, hasRecentActivity]);

  // Update edge animations when changes are detected
  useEffect(() => {
    const { hasChanges, updatedEdges } = edgeUpdates;
    
    if (hasChanges) {
      setEdges(updatedEdges);
    }
  }, [edgeUpdates, setEdges]);

  return {
    edges,
    setEdges,
    onEdgesChange,
    onConnect
  };
}