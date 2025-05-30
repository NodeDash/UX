import { AppNode } from '../components/nodes/types';
import { Edge } from '@xyflow/react';

/**
 * Interface representing a Flow in the application.
 * A Flow is a collection of nodes and edges that define a workflow or process.
 */
export interface Flow {
  /** Unique identifier for the flow */
  id: string;
  /** Display name of the flow */
  name: string;
  /** Detailed description of the flow's purpose */
  description: string;
  /** status */
  status: string;
  /** Array of nodes in the flow */
  nodes?: AppNode[];
  /** Array of edges connecting the nodes */
  edges?: Edge[];
  /** Optional viewport information for the flow editor */
  viewport?: {
    /** X coordinate of the viewport */
    x: number;
    /** Y coordinate of the viewport */
    y: number;
    /** Zoom level of the viewport */
    zoom: number;
  };
  /** ISO timestamp when the flow was created */
  created_at: string;
  /** ISO timestamp when the flow was last updated */
  updated_at: string;
}

