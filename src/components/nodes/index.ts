import type { NodeTypes } from '@xyflow/react';

import { DeviceNode } from './DeviceNode';
import { FunctionNode } from './FunctionNode';
import { IntegrationNode } from './IntegrationNode';
import { StorageNode } from './StorageNode';
import { ActionNode } from './ActionNode';
import { LabelNode } from './LabelNode';
import { AppNode } from './types';

export const initialNodes: AppNode[] = [
  {
    id: 'b',
    type: 'device',
    position: { x: -150, y: 150 },
    data: { 
      label: 'Temperature Sensor',
      nodeType: 'device'
    },
  },
  {
    id: 'c',
    type: 'function',
    position: { x: 75, y: 150 },
    data: { 
      label: 'Decoder Function',
      nodeType: 'function'
    },
  },
  {
    id: 'd',
    type: 'integration',
    position: { x: 300, y: 100 },
    data: { 
      label: 'Trackpac Integration',
      nodeType: 'integration'
    },
  },
  {
    id: 'e',
    type: 'integration',
    position: { x: 300, y: 150 },
    data: { 
      label: 'MQTT Integration',
      nodeType: 'integration'
    },
  },
  /*
  {
    id: 'f',
    type: 'storage',
    position: { x: 300, y: 200 },
    data: { 
      label: 'InfluxDB Storage',
      nodeType: 'storage',
      host: 'localhost',
      port: 8086,
      database: 'sensor_data'
    },
  },

  {
    id: 'g',
    type: 'action',
    position: { x: 300, y: 250 },
    data: { 
      label: 'Temperature Alert',
      nodeType: 'action',
      inputField: 'temperature',
      operator: '>',
      compareValue: 30,
      actionType: 'sms',
      actionConfig: {
        phoneNumber: '+1234567890',
        message: 'Temperature exceeded threshold!'
      }
    },
  }
    */
];

export const nodeTypes = {
  'device': DeviceNode,
  'function': FunctionNode,
  'integration': IntegrationNode,
  'label': LabelNode,
  'storage': StorageNode,
  'action': ActionNode,
} satisfies NodeTypes;

// Export individual nodes for direct imports
export { DeviceNode, FunctionNode, IntegrationNode, StorageNode, ActionNode, LabelNode };
