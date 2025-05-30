import { toast, ToastOptions } from 'react-toastify';
import { useTheme } from '@/context/ThemeContext';

/**
 * Hook that provides simplified toast notification methods with consistent styling
 * 
 * @returns Object with toast methods (success, error, info, warning)
 */
export function useToast() {
  const { theme } = useTheme();
  
  // Default toast configuration
  const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    theme: theme,
    
  };

  return {
    /**
     * Show a success toast notification
     * 
     * @param message - The message to display
     * @param options - Optional toast configuration overrides
     */
    success: (message: string, options?: ToastOptions) => {
      toast.success(message, { ...defaultOptions, ...options });
    },

    /**
     * Show an error toast notification
     * 
     * @param message - The message to display
     * @param options - Optional toast configuration overrides
     */
    error: (message: string, options?: ToastOptions) => {
      toast.error(message, { ...defaultOptions, ...options });
    },

    /**
     * Show an info toast notification
     * @param message The message to display
     * @param options Optional toast configuration overrides
     */
    info: (message: string, options?: ToastOptions) => {
      toast.info(message, { ...defaultOptions, ...options });
    },

    /**
     * Show a warning toast notification
     * @param message The message to display
     * @param options Optional toast configuration overrides
     */
    warning: (message: string, options?: ToastOptions) => {
      toast.warning(message, { ...defaultOptions, ...options });
    },
  };
}