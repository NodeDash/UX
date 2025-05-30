export interface Integration {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, string | number | boolean | object | unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface HttpHeader {
  key: string;
  value: string;
}
