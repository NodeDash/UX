import React from "react";
import { useTranslation } from "react-i18next";
import {
  Provider,
  CreateProviderDto,
  UpdateProviderDto,
} from "@/types/provider.types";
import { useToast } from "@/hooks/ux/useToast";
import { ErrorMessage, Table, TableActions, StatusBadge } from "../ui";
import ProviderForm from "../forms/ProviderForm";
import { useUpdateProvider, useCreateProvider } from "@/hooks/api/useProviders";
import TableColumnActions from "@/components/tables/TableColumnActions";
import { useProvidersTable } from "@/hooks/query/tables/useProvidersTable";

interface ProvidersTableProps {
  className?: string;
}

export const ProvidersTable: React.FC<ProvidersTableProps> = ({
  className = "",
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  // Use our custom hook that encapsulates all provider-related data operations
  const {
    data: providers,
    isLoading,
    error,
    selectedItem: selectedProvider,
    isEditorOpen,
    handleRefresh,
    openEditor,
    closeEditor,
  } = useProvidersTable();

  // Keep separate mutation hooks for create/update since they're not included in useProvidersTable
  const { mutateAsync: createProviderAsync } = useCreateProvider({
    onSuccess: () => toast.success(t("providers.providerCreated")),
    onError: () => toast.error(t("providers.errorCreating")),
  });

  const { mutateAsync: updateProviderAsync } = useUpdateProvider({
    onSuccess: () => toast.success(t("providers.providerUpdated")),
    onError: () => toast.error(t("providers.errorUpdating")),
  });

  // Handle provider update with specific provider format
  const handleUpdateProvider = (id: string, data: UpdateProviderDto) => {
    return updateProviderAsync({ id, updates: data })
      .then(() => {
        closeEditor();
        return true;
      })
      .catch(() => false);
  };

  const columns = [
    {
      key: "name",
      header: t("common.name"),
      render: (provider: Provider) => (
        <>
          <div className="text-lg font-medium">{provider.name}</div>
          <span className="text-sm">{provider.description || ""}</span>
        </>
      ),
    },
    {
      key: "type",
      header: t("providers.type"),
      render: (provider: Provider) => (
        <StatusBadge status={provider.provider_type} type="provider_type" />
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (provider: Provider) => (
        <TableColumnActions
          entityId={provider.id}
          entityType="provider"
          entityName={provider.name}
          onEdit={() => openEditor(provider)}
          showHistory={false}
        />
      ),
    },
  ];

  return (
    <>
      {error && <ErrorMessage message={t("providers.failedToLoadProviders")} />}

      <Table
        columns={columns}
        data={providers || []}
        isLoading={isLoading}
        emptyMessage={t("providers.noProviders")}
        keyExtractor={(provider) => provider.id.toString()}
        title={t("common.all", {
          name: t("providers.providers"),
        })}
        className={className}
        actionButton={
          <TableActions
            onRefresh={handleRefresh}
            onAdd={() => openEditor()}
            addButtonText={t("providers.add")}
          />
        }
      />

      {isEditorOpen && (
        <ProviderForm
          isOpen={isEditorOpen}
          onClose={closeEditor}
          onSubmit={(data) => {
            if (selectedProvider) {
              return handleUpdateProvider(selectedProvider.id, data);
            } else {
              return createProviderAsync(data as CreateProviderDto)
                .then(() => {
                  closeEditor();
                  return true;
                })
                .catch(() => {
                  return false;
                });
            }
          }}
          isEdit={!!selectedProvider}
          provider={selectedProvider || undefined}
        />
      )}
    </>
  );
};

export default ProvidersTable;
