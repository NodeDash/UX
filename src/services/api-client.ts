import axios, { AxiosError } from 'axios';
import { config } from './config.service';
import { apiDeviceToClientDevice, clientDeviceToApiDevice, ApiDevice } from './api-adapters';
import { Device } from '../types/device.types';

/**
 * Axios instance configured for API requests.
 */
const axiosInstance = axios.create({
  baseURL: config.api.baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
});

/**
 * Intercepts requests to add authentication token.
 */
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Intercepts responses to handle authentication errors.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors by redirecting to login
    if (error.response && error.response.status === 401) {
      // Clear the token from storage
      localStorage.removeItem('auth_token');
      
      // Only redirect if we're not already on an auth page
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') && 
        !currentPath.includes('/register') &&
        !currentPath.includes('/forgot-password') &&
        !currentPath.includes('/reset-password')
      ) {
        window.location.href = '/login?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Client for making API requests with automatic conversion between client and API models.
 */
class ApiClient {
  /**
   * Performs a GET request to the API.
   * @param {string} url - The API endpoint URL.
   * @param {Object} config - Request configuration.
   * @param {Record<string, unknown>} [config.params] - URL query parameters.
   * @returns {Promise<T>} Promise resolving to the converted response data.
   * @template T - Type of the expected response data.
   */
  async get<T>(url: string, config: { params?: Record<string, unknown> } = {}): Promise<T> {
    const response = await axiosInstance.get<unknown>(this.mapUrlToOpenApi(url), config);
    return response.data as T;
  }

  /**
   * Performs a POST request to the API.
   * @param {string} url - The API endpoint URL.
   * @param {Record<string, unknown>} data - Request body data.
   * @param {Object} config - Request configuration.
   * @param {Record<string, unknown>} [config.params] - URL query parameters.
   * @returns {Promise<T>} Promise resolving to the converted response data.
   * @template T - Type of the expected response data.
   */
  async post<T>(url: string, data: Record<string, unknown>, config: { params?: Record<string, unknown> } = {}): Promise<T> {
    try {
      const apiData = this.convertClientModelToApiRequest(url, data);
      const response = await axiosInstance.post<unknown>(this.mapUrlToOpenApi(url), apiData, config);
      return this.convertApiResponseToClientModel(url, response.data) as T;
    } catch (error) {
      // Better error handling for API validation errors
      const axiosError = error as AxiosError;
      if (axiosError.response?.data) {
        console.error('API Error Response:', axiosError.response.data);
        
        // Handle FastAPI validation errors
        const responseData = axiosError.response.data as any;
        if (responseData && Array.isArray(responseData.detail)) {
          const validationErrors = responseData.detail;
          const errorFields = validationErrors.map((err: any) => {
            return `${err.loc[err.loc.length - 1]}: ${err.msg}`;
          }).join(', ');
          
          throw new Error(`Validation error: ${errorFields}`);
        }
      }
      throw error;
    }
  }

  /**
   * Performs a PUT request to the API.
   * @param {string} url - The API endpoint URL.
   * @param {Record<string, unknown>} data - Request body data.
   * @param {Object} config - Request configuration.
   * @param {Record<string, unknown>} [config.params] - URL query parameters.
   * @returns {Promise<T>} Promise resolving to the converted response data.
   * @template T - Type of the expected response data.
   */
  async put<T>(url: string, data: Record<string, unknown>, config: { params?: Record<string, unknown> } = {}): Promise<T> {
    const apiData = this.convertClientModelToApiRequest(url, data);
    const response = await axiosInstance.put<unknown>(this.mapUrlToOpenApi(url), apiData, config);
    return this.convertApiResponseToClientModel(url, response.data) as T;
  }

  /**
   * Performs a DELETE request to the API.
   * @param {string} url - The API endpoint URL.
   * @param {Object} config - Request configuration.
   * @param {Record<string, unknown>} [config.params] - URL query parameters.
   * @returns {Promise<T>} Promise resolving to the converted response data.
   * @template T - Type of the expected response data.
   */
  async delete<T>(url: string, config: { params?: Record<string, unknown> } = {}): Promise<T> {
    const response = await axiosInstance.delete<unknown>(this.mapUrlToOpenApi(url), config);
    return this.convertApiResponseToClientModel(url, response.data) as T;
  }

  /**
   * Maps internal URL paths to OpenAPI specification paths.
   * @param {string} url - Internal URL path.
   * @returns {string} OpenAPI specification path.
   * @private
   */
  private mapUrlToOpenApi(url: string): string {
    // Add /api/v1 prefix to align with OpenAPI spec
    if (!url.startsWith('/api/v1')) {
        return `/api/v1${url}`;
    }
    return url;
  }

  /**
   * Converts API response to client model format.
   * @param {string} url - The API endpoint URL.
   * @param {unknown} data - Response data from API.
   * @returns {unknown} Converted client model.
   * @private
   */
  private convertApiResponseToClientModel(url: string, data: unknown): unknown {
    // Determine resource type from URL and convert appropriately
    if ((url.includes('/devices/') || url === '/api/v1/devices/') && !url.includes('history')) {
      if (Array.isArray(data)) {
        return data.map(item => apiDeviceToClientDevice(item as unknown as ApiDevice));
      } else {
        return apiDeviceToClientDevice(data as unknown as ApiDevice);
      }
    }
    
    // Add converters for other resource types
    
    return data;
  }
  
  /**
   * Converts client model to API request format.
   * @param {string} url - The API endpoint URL.
   * @param {Record<string, unknown>} data - Client model data.
   * @returns {Record<string, unknown>} Converted API model.
   * @private
   */
  private convertClientModelToApiRequest(url: string, data: Record<string, unknown>): Record<string, unknown> {
    // Specifically handle device creation to ensure required fields
    if (url.includes('/devices') && !url.includes('/devices/')) {
      // This is a device creation request - ensure required fields
      const requiredFields = ['dev_eui', 'app_eui', 'app_key'];
      for (const field of requiredFields) {
        if (!data[field] && !data[field.replace('_', '')]) {
          console.warn(`Required field ${field} missing in request data`);
        }
      }
      
      // Map camelCase to snake_case for device fields
      const apiData: Record<string, unknown> = { ...data };
      if (data.dev_eui && !data.dev_eui) apiData.dev_eui = data.dev_eui;
      if (data.app_eui && !data.app_eui) apiData.app_eui = data.app_eui;
      if (data.appKey && !data.app_key) apiData.app_key = data.appKey;
      if (data.labelIds && !data.label_ids) {
        apiData.label_ids = Array.isArray(data.labelIds) ? data.labelIds : [data.labelIds];
      }
      
      return apiData;
    }
    
    // Determine resource type from URL and convert appropriately
    if (url.includes('/devices/') || url === '/api/v1/devices/') {
      // Cast data to Partial<Device> to satisfy the type requirement
      return clientDeviceToApiDevice(data as Partial<Device>);
    }
    
    // Add converters for other resource types
    
    // Default - return data as is
    return data;
  }
}

/**
 * Instance of the ApiClient for application use.
 */
export const apiClient = new ApiClient();