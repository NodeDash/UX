export interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'never_seen';
  dev_eui: string;
  app_eui: string;
  app_key: string;
  region: 'EU868' | 'US915' | 'AU915' | 'AS923';
  is_class_c: boolean;
  label_ids: number[]; // Array of label IDs
  expected_transmit_time: number; // In minutes: 1-1440 (1 minute to 24 hours)
  lastSeen: string;
  created_at: string;
  updated_at: string;
}