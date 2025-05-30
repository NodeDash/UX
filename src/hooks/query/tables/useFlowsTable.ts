import { useTranslation } from 'react-i18next';
import { Flow } from '@/types';
import { useFlows, useDeleteFlow, useUpdateFlow } from '@/hooks/api';
import { useTableData } from './useTableData';

/**
 * Custom hook to provide all flow table operations in a single place
 * This encapsulates the flow-related data fetching and mutations
 */
export function useFlowsTable() {
  const { t } = useTranslation();

  // Get query and mutation hooks
  const flowsQuery = useFlows();
  const deleteFlowMutation = useDeleteFlow();
  const updateFlowMutation = useUpdateFlow();

  // Use the standardized table data hook with our flow-specific operations
  return useTableData<Flow, any, any>({
    queryResult: flowsQuery,
    mutations: {
      delete: deleteFlowMutation.mutateAsync,
      update: (id, updates) => updateFlowMutation.mutateAsync({ id, updates }),
      
    },
    messages: {
      entityName: "flow",
      deleted: t("flows.flowDeleted"),
      updated: t("flows.flowUpdated"),
      failedToDelete: t("flows.failedToDelete"),
      failedToUpdate: t("flows.failedToUpdate"),
      confirmDelete: t("flows.confirmDeleteFlow"),
    },
  });
}