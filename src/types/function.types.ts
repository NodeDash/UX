export interface CustomFunction {
  id: string;
  name: string;
  description?: string;
  status: 'success' | 'error' | 'pending' | 'partial_success';
  parameters?: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required: boolean;
    default?: string | number | boolean | object | Record<string, unknown>[];
  }[];
  code: string;
  created_at: Date;
  updated_at: Date;
}