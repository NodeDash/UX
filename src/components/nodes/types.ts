import { Node } from '@xyflow/react';

interface NodeData {
  label: string;
  nodeType: 'device' | 'function' | 'integration' | 'position-logger' | 'storage' | 'action' | 'label';
  entityId?: string;
  status?: 'success' | 'error' | 'partial_success' | 'no_history';
  [key: string]: string | number | boolean | object | undefined;
}

export interface AppNode extends Node {
  type: string;
  data: NodeData;
  error?: boolean;
}

export interface DeviceNode extends AppNode {
  type: 'device';
}

export interface FunctionNode extends AppNode {
  type: 'function';
}

export interface IntegrationNode extends AppNode {
  type: 'integration';
}

export interface LabelNode extends AppNode {
  type: 'label';
}
export interface StorageNode extends AppNode {
  type: 'storage';
  data: {
    label: string;
    nodeType: 'storage';
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
  };
}

export interface ActionNode extends AppNode {
  type: 'action';
  data: {
    label: string;
    nodeType: 'action';
    inputField?: string;
    operator?: '>' | '=' | '<' | '===' | '>=' | '<=';
    compareValue?: string | number;
    actionType?: 'sms' | 'email' | 'webhook';
    actionConfig?: {
      // SMS config
      phoneNumber?: string;
      message?: string;
      // Email config
      emailTo?: string;
      emailSubject?: string;
      emailBody?: string;
      // Webhook config
      webhookUrl?: string;
      webhookMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      webhookHeaders?: string;
      webhookBody?: string;
    };
  };
}
