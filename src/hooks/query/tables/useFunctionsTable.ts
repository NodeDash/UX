import { useTranslation } from 'react-i18next';
import { CustomFunction } from '@/types';
import { useFunctions, useDeleteFunction, useUpdateFunction } from '@/hooks/api';
import { useTableData } from './useTableData';

/**
 * Custom hook to provide all function table operations in a single place
 * 
 * @returns Consolidated object containing function data, mutation functions, loading states, and error handling
 */
export function useFunctionsTable() {
  const { t } = useTranslation();

  const functionsQuery = useFunctions();
  const deleteFunctionMutation = useDeleteFunction();
  const updateFunctionMutation = useUpdateFunction();

  // Use the standardized table data hook with our function-specific operations
  return useTableData<CustomFunction, any, any>({
    queryResult: functionsQuery,
    mutations: {
      delete: deleteFunctionMutation.mutateAsync,
      update: (id, updates) => updateFunctionMutation.mutateAsync({ id, updates }),
    },
    messages: {
      entityName: "function",
      deleted: t("functions.functionDeleted"),
      updated: t("functions.functionUpdated"),
      failedToDelete: t("functions.errorDeleting"),
      failedToUpdate: t("functions.errorUpdating"),
      confirmDelete: t("functions.confirmDeleteFunction"),
    },
  });
}