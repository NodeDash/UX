import { useTranslation } from 'react-i18next';
import { Label } from '@/types';
import { 
  useLabels, 
  useDeleteLabel, 
  useUpdateLabel, 
  useCreateLabel 
} from '@/hooks/api';
import { useTableData } from './useTableData';

/**
 * Custom hook to provide all label table operations in a single place
 * 
 * @returns Consolidated object containing label data, mutation functions, loading states, and error handling
 */
export function useLabelsTable() {
  const { t } = useTranslation();

  // Get query and mutation hooks
  const labelsQuery = useLabels();
  const deleteLabelMutation = useDeleteLabel();
  const updateLabelMutation = useUpdateLabel();
  const createLabelMutation = useCreateLabel();

  // Use the standardized table data hook with our label-specific operations
  return useTableData<Label, any, any>({
    queryResult: labelsQuery,
    mutations: {
      delete: deleteLabelMutation.mutateAsync,
      update: (id, updates) => updateLabelMutation.mutateAsync({ id, updates }),
      create: createLabelMutation.mutateAsync,
    },
    messages: {
      entityName: "label",
      deleted: t("labels.labelDeleted"),
      created: t("labels.labelCreated"),
      updated: t("labels.labelUpdated"),
      failedToDelete: t("labels.errorDeleting"),
      failedToCreate: t("labels.errorCreating"),
      failedToUpdate: t("labels.errorUpdating"),
      confirmDelete: t("labels.confirmDeleteLabel"),
    },
  });
}