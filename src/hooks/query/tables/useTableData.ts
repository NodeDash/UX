import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/ux/useToast";

export interface UseTableDataOptions<T, CreateDto, UpdateDto> {
  // Query hook result containing data, loading state, and error
  queryResult: {
    data?: T[];
    isLoading: boolean;
    error: any;
    refetch: () => Promise<any>;
  };
  // Mutation functions for CRUD operations
  mutations: {
    create?: (data: CreateDto) => Promise<any>;
    update?: (id: string, data: UpdateDto) => Promise<any>;
    delete?: (id: string) => Promise<any>;
  };
  // Translation keys for messages
  messages: {
    entityName: string; // Singular name of entity (e.g., "device")
    created?: string; // Translation key or direct message for creation success
    updated?: string; // Translation key or direct message for update success
    deleted?: string; // Translation key or direct message for deletion success
    failedToCreate?: string; // Translation key or direct message for creation failure
    failedToUpdate?: string; // Translation key or direct message for update failure
    failedToDelete?: string; // Translation key or direct message for deletion failure
    confirmDelete?: string; // Translation key or direct message for delete confirmation
  };
  // Query invalidation config for React Query
  queryInvalidation?: {
    queryKey: unknown[];
  };
}

/**
 * Hook that standardizes data management for table components with CRUD operations
 * 
 * @template T - The entity type (must have an id property)
 * @template CreateDto - The data type for creating new entities
 * @template UpdateDto - The data type for updating existing entities
 * @param options - Configuration options for the table data
 * @returns Object containing data and handlers for the table component
 */
export function useTableData<T extends { id: string }, CreateDto, UpdateDto>(
  options: UseTableDataOptions<T, CreateDto, UpdateDto>
) {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Extract data from query result
  const { data = [], isLoading, error, refetch } = options.queryResult;
  const { create, update, delete: deleteItem } = options.mutations;
  const { entityName, created, updated, deleted, failedToCreate, failedToUpdate, failedToDelete, confirmDelete } = options.messages;

  // Standardized handlers for CRUD operations
  const handleCreate = async (createData: CreateDto) => {
    if (!create) return;
    
    try {
      await create(createData);
      toast.success(created || t("common.itemCreated", { name: entityName }));
      setIsEditorOpen(false);
      
      if (options.queryInvalidation) {
        queryClient.invalidateQueries({
          queryKey: options.queryInvalidation.queryKey
        });
      } else {
        refetch();
      }
      
      return true;
    } catch (err) {
      console.error(`Error creating ${entityName}:`, err);
      toast.error(failedToCreate || t("common.failedToCreate", { name: entityName }));
      return false;
    }
  };

  const handleUpdate = async (id: string, updateData: UpdateDto) => {
    if (!update) return;
    
    try {
      await update(id, updateData);
      toast.success(updated || t("common.itemUpdated", { name: entityName }));
      setIsEditorOpen(false);
      setSelectedItem(null);
      
      if (options.queryInvalidation) {
        queryClient.invalidateQueries({
          queryKey: options.queryInvalidation.queryKey
        });
      } else {
        refetch();
      }
      
      return true;
    } catch (err) {
      console.error(`Error updating ${entityName}:`, err);
      toast.error(failedToUpdate || t("common.failedToUpdate", { name: entityName }));
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    if (!deleteItem) return;
    
    const confirmMsg = confirmDelete || t("common.confirmDelete", { name: entityName });
    if (!window.confirm(confirmMsg)) {
      return false;
    }
    
    try {
      await deleteItem(id);
      toast.success(deleted || t("common.itemDeleted", { name: entityName }));
      
      if (options.queryInvalidation) {
        queryClient.invalidateQueries({
          queryKey: options.queryInvalidation.queryKey
        });
      } else {
        refetch();
      }
      
      return true;
    } catch (err) {
      console.error(`Error deleting ${entityName}:`, err);
      toast.error(failedToDelete || t("common.failedToDelete", { name: entityName }));
      return false;
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.info(t("common.refreshing"));
  };

  const openEditor = (item?: T) => {
    setSelectedItem(item || null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setSelectedItem(null);
  };

  return {
    data,
    isLoading,
    error,
    selectedItem,
    isEditorOpen,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleRefresh,
    openEditor,
    closeEditor
  };
}