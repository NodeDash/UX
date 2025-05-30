import { useState, useCallback } from 'react';

/**
 * Hook to manage the various entity selector modals for flow editing
 * 
 * @returns Object containing modal states and handlers for managing flow editor modals
 */
export function useFlowModalState() {
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [functionSelectorOpen, setFunctionSelectorOpen] = useState(false);
  const [integrationSelectorOpen, setIntegrationSelectorOpen] = useState(false);
  const [deviceSelectorOpen, setDeviceSelectorOpen] = useState(false);
  const [labelSelectorOpen, setLabelSelectorOpen] = useState(false);

  /**
   * Handles selection of a node type and opens the appropriate entity selector modal
   * 
   * @param nodeType - The type of node selected in the node selector
   */
  const handleNodeTypeSelect = useCallback(
    (nodeType: "device" | "function" | "integration" | "label") => {
      setIsNodeSelectorOpen(false);

      // For entity-based nodes, open entity selector modal
      if (nodeType === "function") {
        setFunctionSelectorOpen(true);
      } else if (nodeType === "integration") {
        setIntegrationSelectorOpen(true);
      } else if (nodeType === "device") {
        setDeviceSelectorOpen(true);
      } else if (nodeType === "label") {
        setLabelSelectorOpen(true);
      }
    },
    []
  );

  return {
    isNodeSelectorOpen,
    setIsNodeSelectorOpen,
    functionSelectorOpen,
    setFunctionSelectorOpen,
    integrationSelectorOpen,
    setIntegrationSelectorOpen,
    deviceSelectorOpen,
    setDeviceSelectorOpen,
    labelSelectorOpen,
    setLabelSelectorOpen,
    handleNodeTypeSelect
  };
}