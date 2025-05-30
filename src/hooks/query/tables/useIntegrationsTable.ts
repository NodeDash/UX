import { useTranslation } from 'react-i18next';
import { Integration } from '@/types';
import { 
  useIntegrations, 
  useDeleteIntegration, 
  useUpdateIntegration, 
  useCreateIntegration 
} from '@/hooks/api';
import { useTableData } from './useTableData';

/**
 * Custom hook to provide all integration table operations in a single place
 * This encapsulates the integration-related data fetching and mutations
 */
export function useIntegrationsTable() {
  const { t } = useTranslation();

  // Get query and mutation hooks
  const integrationsQuery = useIntegrations();
  const deleteIntegrationMutation = useDeleteIntegration();
  const updateIntegrationMutation = useUpdateIntegration();
  const createIntegrationMutation = useCreateIntegration();

  // Use the standardized table data hook with our integration-specific operations
  return useTableData<Integration, any, any>({
    queryResult: integrationsQuery,
    mutations: {
      delete: deleteIntegrationMutation.mutateAsync,
      update: (id, updates) => updateIntegrationMutation.mutateAsync({ id, updates }),
      create: createIntegrationMutation.mutateAsync,
    },
    messages: {
      entityName: "integration",
      deleted: t("integrations.integrationDeleted"),
      created: t("integrations.integrationCreated"),
      updated: t("integrations.integrationUpdated"),
      failedToDelete: t("integrations.errorDeleting"),
      failedToCreate: t("integrations.errorCreating"),
      failedToUpdate: t("integrations.errorUpdating"),
      confirmDelete: t("integrations.confirmDeleteIntegration"),
    },
  });
}