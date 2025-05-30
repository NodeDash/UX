import React from "react";
import { ReactFlowInstance, OnNodesChange, Edge } from "@xyflow/react";
import { AppNode } from "@/components/nodes/types";
import {
  FlowCanvas,
  FlowToolbar,
  UnsavedChangesAlert,
} from "@/components/flow";

interface FlowCanvasWrapperProps {
  flowId?: string;
  nodes: AppNode[];
  edges: Edge[];
  nodeTypes: any;
  edgeTypes: any;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onInit: (instance: ReactFlowInstance<AppNode, Edge>) => void;
  isLocked: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onLockToggle: () => void;
  onAddNodeClick: () => void;
  onSave: () => Promise<void>;
  colorMode: "light" | "dark";
  isMobile: boolean;
  children?: React.ReactNode;
}

/**
 * Component that wraps the main flow canvas and its toolbar
 * Separates canvas rendering from the page component logic
 */
const FlowCanvasWrapper: React.FC<FlowCanvasWrapperProps> = ({
  flowId,
  nodes,
  edges,
  nodeTypes,
  edgeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onInit,
  isLocked,
  isSaving,
  hasUnsavedChanges,
  onLockToggle,
  onAddNodeClick,
  onSave,
  colorMode,
  isMobile,
  children,
}) => {
  return (
    <FlowCanvas
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      colorMode={colorMode}
      isLocked={isLocked}
      isMobile={isMobile}
    >
      <FlowToolbar
        flowId={flowId}
        isLocked={isLocked}
        isSaving={isSaving}
        onLockToggle={onLockToggle}
        onAddNodeClick={onAddNodeClick}
        hasUnsavedChanges={hasUnsavedChanges && !isLocked}
        onSave={onSave}
        isMobile={isMobile}
      />

      {hasUnsavedChanges && !isLocked && (
        <UnsavedChangesAlert
          onSave={onSave}
          isSaving={isSaving}
          isMobile={isMobile}
        />
      )}

      {children}
    </FlowCanvas>
  );
};

export default FlowCanvasWrapper;
