import { functionService } from '@/services/function.service';
import { getFunctionHistory } from '@/services/function-history.service';
import { Function as FlowFunction, FunctionCreate, FunctionUpdate } from '@/types';
import { queryKeys } from '../query/queryKeys';
import { createBaseApiHooks } from './baseApiHooks';
import { DataPriority } from '../query/queryUtils';

/**
 * Creates standardized function API hooks using the hook factory
 * Uses specific query keys and service functions for function-related operations
 */
const functionHooks = createBaseApiHooks<FlowFunction, FunctionCreate, FunctionUpdate>({
  queryKeys: {
    all: queryKeys.functions.all,
    detail: queryKeys.functions.detail,
    history: queryKeys.functions.history
  },
  services: {
    getAll: functionService.getFunctions,
    getById: functionService.getFunctionById,
    create: functionService.createFunction,
    update: functionService.updateFunction,
    delete: functionService.deleteFunction,
    getHistory: getFunctionHistory
  },
  // Set data priorities for different function queries
  priorities: {
    // Function list doesn't change as frequently as device status
    list: DataPriority.MEDIUM,
    // Function details are important when editing or viewing them
    detail: DataPriority.HIGH,
    // Function history is less critical for real-time updates
    history: DataPriority.MEDIUM
  }
});

/**
 * Hook to fetch all functions for the current team context
 * @returns Object containing functions data, loading state, error state, and refetch function
 */
export const useFunctions = functionHooks.useAll;

/**
 * Hook to fetch a single function by ID
 * @param id - The ID of the function to fetch
 * @returns Object containing function data, loading state, error state, and refetch function
 */
export const useFunction = functionHooks.useOne;

/**
 * Hook to create a new function
 * @returns Object containing mutation function and mutation state
 */
export const useCreateFunction = functionHooks.useCreate;

/**
 * Hook to update an existing function
 * @returns Object containing mutation function and mutation state
 */
export const useUpdateFunction = functionHooks.useUpdate;

/**
 * Hook to delete a function
 * @returns Object containing mutation function and mutation state
 */
export const useDeleteFunction = functionHooks.useDelete;

/**
 * Hook to fetch function history for a specific function
 * @param id - The ID of the function to fetch history for
 * @returns Object containing function history data, loading state, error state, and refetch function
 */
export const useFunctionHistory = functionHooks.useHistory;
