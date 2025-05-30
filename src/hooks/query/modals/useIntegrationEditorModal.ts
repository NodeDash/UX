import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { HttpHeader, Integration } from '@/types/integration.types';
import { useTeamContext } from '@/context/TeamContext';
import { useToast } from '@/hooks/ux/useToast';
import { integrationService } from '@/services/integration.service';
import { useStandardCreateMutation, useStandardUpdateMutation } from '../queryUtils';
import { queryKeys } from '../queryKeys';

/**
 * Props for the useIntegrationEditorModal hook.
 */
interface UseIntegrationEditorModalProps {
  /** The integration to edit, or undefined when creating a new integration */
  integration?: Integration;
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * Custom hook that manages the state and operations for the integration editor modal.
 * Handles creation and updating of integration entities, form validation, and API interactions.
 * Supports both HTTP and MQTT integration types.
 * 
 * @param {UseIntegrationEditorModalProps} props - The props for the hook
 * @returns State and handlers for the integration editor modal
 */
export const useIntegrationEditorModal = ({
  integration,
  onClose,
}: UseIntegrationEditorModalProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { selectedContext } = useTeamContext();

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<'http' | 'mqtt'>('http');
  const [url, setUrl] = useState('');
  
  // HTTP specific state
  const [headers, setHeaders] = useState<HttpHeader[]>([
    { key: '', value: '' }
  ]);
  
  // MQTT specific state
  const [ssl, setSsl] = useState('false');
  const [sslCertificate, setSslCertificate] = useState('');
  const [topic, setTopic] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);

  /** Whether the modal is in edit mode (true) or create mode (false) */
  const isEditMode = Boolean(integration);

  /**
   * Initializes form values based on whether we're editing an existing integration
   * or creating a new one. Populates appropriate fields based on integration type.
   */
  useEffect(() => {
    if (integration) {
      // Edit mode - populate form with existing data
      setName(integration.name);
      setType(integration.type as 'http' | 'mqtt');

      if (integration.type === 'http') {
        const config = integration.config as Record<string, unknown>;
        setUrl((config.url as string) || '');

        // Convert headers object to array for the form
        const headersObj = (config.headers as Record<string, string>) || {};
        const headerEntries = Object.entries(headersObj);
        setHeaders(
          headerEntries.length > 0
            ? headerEntries.map(([key, value]) => ({ key, value }))
            : [{ key: '', value: '' }]
        );
      } else if (integration.type === 'mqtt') {
        const config = integration.config as Record<string, unknown>;
        setUrl((config.url as string) || '');
        setSsl((config.ssl as string) || 'false');
        setSslCertificate((config.sslCertificate as string) || '');
        setTopic((config.topic as string) || '');
        setUsername((config.username as string) || '');
        setPassword((config.password as string) || '');
      }
    } else {
      // Create mode - reset form
      setName('');
      setType('http');
      setUrl('');
      setHeaders([{ key: '', value: '' }]);
      setSsl('false');
      setSslCertificate('');
      setTopic('');
      setUsername('');
      setPassword('');
    }
    setError(null);
  }, [integration]);


  const handleCreateError = useCallback((err: Error) => {
    setError(err instanceof Error ? err.message : t('integrations.failedToSave'));
    toast.error(err instanceof Error ? err.message : t('integrations.failedToSave'));
  }, [toast, t]);

  // Create integration mutation
  const createMutation = useStandardCreateMutation<
    Integration, 
    { name: string; type: string; config: Record<string, any> }
  >(
    queryKeys.integrations,
    (data) => {
      const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
      return integrationService.createIntegration(data, teamId);
    },
    {
      onError: handleCreateError
    }
  );


  const handleUpdateError = useCallback((err: Error) => {
    setError(err instanceof Error ? err.message : t('integrations.failedToSave'));
    toast.error(err instanceof Error ? err.message : t('integrations.failedToSave'));
  }, [toast, t]);

  // Update integration mutation
  const updateMutation = useStandardUpdateMutation<
    Integration, 
    { name: string; type: string; config: Record<string, any> }
  >(
    queryKeys.integrations,
    (id, data) => integrationService.updateIntegration(id, data),
    {
      onError: handleUpdateError
    }
  );

  const addHeader = useCallback(() => {
    setHeaders([...headers, { key: '', value: '' }]);
  }, [headers]);

  const removeHeader = useCallback((index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  }, [headers]);

  const updateHeader = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      const newHeaders = [...headers];
      newHeaders[index][field] = value;
      setHeaders(newHeaders);
    },
    [headers]
  );

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      setError(t('integrations.errorNameRequired'));
      return;
    }

    if (!url.trim()) {
      setError(t('integrations.errorUrlRequired'));
      return;
    }

    setError(null);

    let config: Record<string, string | Record<string, string>>;

    if (type === 'http') {
      // Create headers object from array
      const headerEntries = headers
        .filter((h) => h.key.trim() !== '') // Only include headers with non-empty keys
        .reduce<Record<string, string>>((acc, { key, value }) => {
          acc[key.trim()] = value;
          return acc;
        }, {});

      config = {
        url,
        headers: headerEntries,
      };
    } else {
      // MQTT config
      config = {
        url,
        ssl,
        topic,
        username,
        password,
      };

      // Only include SSL certificate if SSL is enabled
      if (ssl === 'true' && sslCertificate.trim()) {
        config.sslCertificate = sslCertificate;
      }
    }

    if (isEditMode && integration) {
      // Update existing integration
      updateMutation.mutate({
        id: integration.id,
        updates: {
          name,
          type,
          config
        }
      });
      toast.success(t('integrations.integrationUpdated', { name }));
      
    } else {
      // Create new integration
      createMutation.mutate({
        name,
        type,
        config
      });
      toast.success(t('integrations.integrationCreated', { name }));
    }

    onClose();

  }, [
    name, url, type, headers, ssl, sslCertificate, topic, username, password, 
    isEditMode, integration, createMutation, updateMutation, t, toast, onClose
  ]);

  return {
    name,
    setName,
    type,
    setType,
    url,
    setUrl,
    headers,
    ssl,
    setSsl,
    sslCertificate,
    setSslCertificate,
    topic,
    setTopic,
    username,
    setUsername,
    password,
    setPassword,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    error,
    addHeader,
    removeHeader,
    updateHeader,
    handleSave,
    isEditMode
  };
};