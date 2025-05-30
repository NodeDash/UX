export interface DeviceHistoryEntry {
  id: string;
  device_id: string;
  timestamp: string;
  event: string;
  details: string;
  previousValue: string;
  newValue: string;
  data?: any;
  device?: {
    dev_eui: string;
    id: number;
    name: string;
  };
}