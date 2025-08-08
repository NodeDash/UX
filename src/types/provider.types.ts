import { OwnerType, OwnedResource } from './common.types';

/**
 * Enum for supported provider types
 */
export enum ProviderType {
  chirpstack = 'chirpstack',
  email = 'email',
  sms = 'sms',
  influxdb = 'influxdb', // New storage provider
}

/**
 * Base interface for provider configuration
 * Each specific provider type will extend this with its own configuration fields
 */
export interface ProviderConfig {
  [key: string]: any;
}

/**
 * ChirpStack provider configuration
 */
export interface ChirpStackProviderConfig extends ProviderConfig {
  url: string;
  api_key: string;
  tenant_id?: string;
}

/**
 * Email provider configuration
 */
export interface EmailProviderConfig extends ProviderConfig {
  smtp_server: string;
  smtp_port: number;
  username: string;
  password: string;
  from_email: string;
  use_ssl: boolean;
}

/**
 * SMS provider configuration
 */
export interface SmsProviderConfig extends ProviderConfig {
  api_key: string;
  service: string; // e.g., 'twilio', 'nexmo', etc.
  sender_id?: string;
}

/**
 * InfluxDB provider configuration
 */
export interface InfluxDbProviderConfig extends ProviderConfig {
  url: string;
  org: string;
  bucket: string;
  token: string;
  verify_ssl?: boolean;
  precision?: 'ns' | 'us' | 'ms' | 's';
}

/**
 * Webhook provider configuration
 */
export interface WebhookProviderConfig extends ProviderConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  auth_token?: string;
}

/**
 * Generic provider configuration - customize as needed
 */
export interface GenericProviderConfig extends ProviderConfig {
  [key: string]: any;
}

/**
 * Main Provider interface that represents a service provider entity
 */
export interface Provider extends OwnedResource {
  id: string;
  name: string;
  description?: string;
  config: ProviderConfig;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  provider_type: ProviderType;
}

/**
 * Data needed to create a new provider
 */
export interface CreateProviderDto {
  name: string;
  description?: string;
  provider_type: ProviderType;
  config: ProviderConfig;
  is_active?: boolean;
  owner_type?: OwnerType;
  owner_id?: string;
}

/**
 * Data needed to update an existing provider
 */
export interface UpdateProviderDto {
  name?: string;
  description?: string;
  config?: ProviderConfig;
  is_active?: boolean;
}

/**
 * Provider query parameters used for filtering
 */
export interface ProviderQueryParams {
  type?: ProviderType;
  is_active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}