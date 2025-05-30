import { useState, useEffect, useCallback } from 'react';
import { ReactFlowInstance } from '@xyflow/react';
import { Edge } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { useUpdateFlow } from "@/hooks/api";
import { AppNode } from '@/components/nodes/types';
import { Flow } from '@/types/flow.types';

/**
 * Hook to manage flow saving, locking, and unsaved changes tracking
 * 
 * @param flowId - ID of the flow being edited
 * @param flow - Current flow data from the API
 * @param nodes - Current nodes in the flow editor
 * @param edges - Current edges in the flow editor
 * @param flowInstance - Reference to the ReactFlow instance
 * @returns Object containing flow state and save/lock operations
 */
export function useSaveFlow(
  flowId: string | undefined,
  flow: Flow | undefined,
  nodes: AppNode[],
  edges: Edge[],
  flowInstance: React.MutableRefObject<ReactFlowInstance<AppNode, Edge> | null>
) {
  const [isLocked, setIsLocked] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { mutateAsync: updateFlow } = useUpdateFlow();
  const { t } = useTranslation();

  // Track unsaved changes
  useEffect(() => {
    if (flow && flow.nodes && flow.edges) {
      // For nodes, compare content and ignore position changes and lastUpdated timestamp
      // Create sanitized copies that exclude position and lastUpdated timestamp
      const sanitizeNodeForComparison = (node: AppNode) => {
        // Create a new object without position
        const result = { ...node, position: undefined };
        
        // Make a copy of data without lastUpdated
        if (result.data) {
          // Create new data object omitting lastUpdated
          result.data = Object.entries(result.data).reduce((acc, [key, value]) => {
            if (key !== 'lastUpdated') {
              acc[key] = value;
            }
            return acc;
          }, {} as typeof result.data);
        }
        
        return result;
      };
      
      const nodesContentChanged =
        JSON.stringify(nodes.map(sanitizeNodeForComparison)) !==
        JSON.stringify(flow.nodes.map(sanitizeNodeForComparison));

      // For the actual node update check, include position changes
      const nodesPositionChanged =
        JSON.stringify(nodes.map((n) => n.position)) !==
        JSON.stringify(flow.nodes.map((n) => n.position));

      const edgesChanged =
        JSON.stringify(edges.map((e) => ({ ...e }))) !==
        JSON.stringify(flow.edges.map((e) => ({ ...e })));
        
      setHasUnsavedChanges(
        nodesContentChanged || edgesChanged || nodesPositionChanged
      );
    }
  }, [nodes, edges, flow, flowInstance]);

  // Show warning before navigating away with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isLocked) {
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, isLocked]);

  // Handle in-app navigation away from flow page
  useEffect(() => {
    const handleBeforeNavigate = (e: BeforeUnloadEvent | PopStateEvent) => {
      if (hasUnsavedChanges && !isLocked) {
        const confirmMessage = t("flows.confirmNavigateAway");

        if (e.type === "beforeunload") {
          // For browser refresh or close
          e.preventDefault();
          (e as BeforeUnloadEvent).returnValue = confirmMessage;
          return confirmMessage;
        } else {
          // For in-app navigation
          if (!window.confirm(confirmMessage)) {
            // If the user cancels, prevent navigation
            if (e.preventDefault) {
              e.preventDefault();
            }
            return false;
          }
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeNavigate as any);
    window.addEventListener("popstate", handleBeforeNavigate);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeNavigate as any);
      window.removeEventListener("popstate", handleBeforeNavigate);
    };
  }, [hasUnsavedChanges, isLocked, t]);

  /**
   * Saves the current flow state to the API
   * Includes nodes, edges, and viewport information
   */
  const handleSaveFlow = useCallback(async () => {
    if (!flowId || !flowInstance.current) return;

    setIsSaving(true);
    try {
      const { x, y, zoom } = flowInstance.current.getViewport();
      await updateFlow({
        id: flowId,
        updates: {
          nodes,
          edges,
          viewport: { x, y, zoom },
        },
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error(t("flows.errorSavingLayout"), error);
    } finally {
      setIsSaving(false);
    }
  }, [flowId, flowInstance, nodes, edges, updateFlow, t]);

  /**
   * Toggles the locked state of the flow editor
   * Automatically saves when locking the flow
   */
  const handleLockToggle = useCallback(async () => {
    if (!flowId || !flowInstance.current) return;

    const newLockedState = !isLocked;
    setIsLocked(newLockedState);

    if (newLockedState) {
      // Save flow when locking
      await handleSaveFlow();
    }
  }, [flowId, flowInstance, isLocked, handleSaveFlow]);

  return {
    isLocked,
    setIsLocked,
    isSaving,
    hasUnsavedChanges,
    handleSaveFlow,
    handleLockToggle
  };
}