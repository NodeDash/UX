// Interface for flow execution history entries
export interface FlowHistoryEntry {
  /** Unique identifier for this history entry */
  id: string;
  
  /** The ID of the flow this history entry belongs to */
  flowId: string;
  
  /** The name of the flow for easier reference */
  flowName: string;
  
  /** Status of the flow execution: 'success', 'error', 'partial_success', 'pending' */
  status: 'success' | 'error' | 'partial_success' | 'pending';
  
  /** Any error message if status is 'error' */
  errorMessage?: string;
  
  /** Execution duration in milliseconds */
  duration?: number;
  
  /** Timestamp when this execution started */
  timestamp: string;
  
  /** Optional payload containing execution details */
  details?: {
    /** Number of nodes that executed successfully */
    successfulNodes?: number;
    /** Number of nodes that failed */
    failedNodes?: number;
    /** IDs of the specific nodes that failed */
    failedNodeIds?: string[];
  };
}