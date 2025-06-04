/**
 * Configuration service for the application
 * Provides access to environment variables and configuration settings
 */

const isDevelopment = import.meta.env.DEV;

export const config = {
  /**
   * API configuration
   */
  api: {
    /**
     * The base URL for API requests
     */
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001',
    
    /**
     * The site name from environment variables
     */
    siteName: import.meta.env.VITE_SITE_NAME || 'NodeDash',
    
    /**
     * API mode - 'demo' uses mock data, 'live' uses actual API
     */
    mode: import.meta.env.VITE_API_MODE || 'demo',
    
    /**
     * Check if the API is in demo mode
     */
    isDemoMode: () => config.api.mode === 'demo',
    
    /**
     * Check if the API is in live mode
     */
    isLiveMode: () => config.api.mode === 'live',
    
    /**
     * Check if the application is in development mode
     */
    isDevelopment: () => isDevelopment,

    /**
     * fetch the default refresh rate from environment variable
     * @returns {number} - The default refresh rate in milliseconds
     */
    getDefaultRefreshRate: () => Number(import.meta.env.VITE_DEFAULT_REFRESH_RATE) || 5000,
  },
  
  /**
   * Get the application title with environment information
   * @returns {string} The formatted application title
   */
  getDocumentTitle: () => {
    return `${config.api.siteName} ${isDevelopment ? '(Development)' : ''}`;
  }
};
