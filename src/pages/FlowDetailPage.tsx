import { useRef } from "react";
import { useParams } from "react-router-dom";
import { ReactFlowInstance } from "@xyflow/react";
import { useTheme } from "../context/ThemeContext";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "../components/nodes";
import { AppNode } from "../components/nodes/types";
import { Edge } from "@xyflow/react";
import {
  FlowCanvasWrapper,
  FlowModalManager,
  FlowErrorDisplay,
  FlowLoadingDisplay,
} from "../components/flow";
import {
  useFunctions,
  useIntegrations,
  useLabels,
  useDevices,
} from "@/hooks/api";
import { useFlowEdges } from "../hooks/query/pages/useFlowEdges";
import { useFlowModalState } from "../hooks/query/modals/useFlowModalState";
import { useFlowNodes } from "../hooks/query/pages/useFlowNodes";
import { useIsMobile } from "@/hooks/ux/use-mobile";
import { useFlowData } from "../hooks/query/pages/useFlowData";
import { useSaveFlow } from "@/hooks/api/useSaveFlow";

/**
 * Page component for viewing and editing a flow
 * Refactored to use smaller, focused components and custom hooks
 */
const FlowDetailPage: React.FC = () => {
  // Get flow ID from URL params
  const { flowId } = useParams<{ flowId: string }>();

  // Set up theme and mobile detection
  const { theme } = useTheme();
  const colorMode = theme === "dark" ? "dark" : ("light" as const);
  const reactFlowInstance = useRef<ReactFlowInstance<AppNode, Edge> | null>(
    null
  );
  const isMobile = useIsMobile();

  // Use our centralized flow data hook
  const { flow, flowError, historyData, isLoading } = useFlowData(flowId);

  // Load entity data for node selection
  const { data: functions = [] } = useFunctions();
  const { data: integrations = [] } = useIntegrations();
  const { data: labels = [] } = useLabels();
  const { data: devices = [] } = useDevices();

  // Access modal state - store the full hook result to pass to FlowModalManager
  const modalState = useFlowModalState();
  const { setIsNodeSelectorOpen } = modalState;

  // Initialize flow nodes with history data
  const {
    nodes,
    onNodesChange,
    createNode: hookCreateNode,
    getExistingEntityIds,
  } = useFlowNodes(flow, reactFlowInstance, historyData);

  // Initialize edge management
  const { edges, onEdgesChange, onConnect } = useFlowEdges(
    flow,
    nodes,
    historyData
  );

  // Initialize flow saving and lock state
  const {
    isLocked,
    isSaving,
    hasUnsavedChanges,
    handleSaveFlow,
    handleLockToggle: originalHandleLockToggle,
  } = useSaveFlow(flowId, flow, nodes, edges, reactFlowInstance);

  // Custom lock toggle handler to show diff modal when unlocking with unsaved changes
  const handleLockToggle = async () => {
    // If we're locking the flow, just use the original handler
    if (!isLocked) {
      await originalHandleLockToggle();
      return;
    }

    // Always toggle the lock
    await originalHandleLockToggle();
  };

  // Wrapper for the createNode function to be passed to child components
  const createNode = (
    nodeType:
      | "function"
      | "device"
      | "integration"
      | "position-logger"
      | "storage"
      | "action"
      | "label",
    entityId?: string,
    entityName?: string
  ) => {
    hookCreateNode(nodeType, entityId, entityName);
  };

  // Handle loading and error states
  if (isLoading) {
    return <FlowLoadingDisplay />;
  }

  if (flowError) {
    return <FlowErrorDisplay message={flowError.message} />;
  }

  return (
    <div className="page-container w-full h-full">
      {/* Flow canvas with toolbar */}
      <FlowCanvasWrapper
        flowId={flowId}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={{}}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => {
          reactFlowInstance.current = instance;
        }}
        isLocked={isLocked}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onLockToggle={handleLockToggle}
        onAddNodeClick={() => setIsNodeSelectorOpen(true)}
        onSave={handleSaveFlow}
        colorMode={colorMode}
        isMobile={isMobile}
      />

      {/* Modal manager component - pass modalState instead of individual handlers */}
      <FlowModalManager
        functions={functions}
        integrations={integrations}
        devices={devices}
        labels={labels}
        getExistingEntityIds={getExistingEntityIds}
        createNode={createNode}
        modalState={modalState}
      />
    </div>
  );
};

export default FlowDetailPage;
