import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowInstance,
  NodeTypes,
  EdgeTypes,
  OnNodesChange,
  OnEdgesChange,
  Connection,
} from "@xyflow/react";
import { AppNode } from "../nodes/types";
import { Edge } from "@xyflow/react";

interface FlowCanvasProps {
  nodes: AppNode[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: (connection: Connection) => void;
  onInit?: (instance: ReactFlowInstance<AppNode, Edge>) => void;
  colorMode: "light" | "dark";
  isLocked: boolean;
  children?: React.ReactNode;
  isMobile?: boolean | undefined;
}

/**
 * FlowCanvas component for rendering the ReactFlow canvas
 */
const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  nodeTypes,
  edgeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onInit,
  colorMode,
  isLocked,
  children,
}) => {
  return (
    <div className="flow-container w-full h-full rounded-2xl">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        onInit={onInit}
        colorMode={colorMode}
        panOnDrag={!isLocked}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background />
        {children}
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
