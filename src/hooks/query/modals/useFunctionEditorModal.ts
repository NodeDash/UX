import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTeamContext } from '@/context/TeamContext';
import { CustomFunction } from '@/types/function.types';
import { functionService } from '@/services/function.service';
import { useToast } from '@/hooks/ux/useToast';
import { useStandardCreateMutation, useStandardUpdateMutation } from '../queryUtils';
import { queryKeys } from '../queryKeys';

/**
 * Props for the useFunctionEditorModal hook.
 */
interface UseFunctionEditorModalProps {
  /** The function to edit, or undefined when creating a new function */
  initialFunction?: CustomFunction;
  /** Callback to close the modal */
  onClose: () => void;
  /** Optional callback to refresh data after a function is created or updated */
  onRefresh?: () => void;
}

/**
 * Custom hook that manages the state and operations for the function editor modal.
 * Handles creation and updating of function entities, form validation, and API interactions.
 *
 * @param {UseFunctionEditorModalProps} props - The props for the hook
 * @returns State and handlers for the function editor modal
 */
export const useFunctionEditorModal = ({
  initialFunction,
  onClose,
}: UseFunctionEditorModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { selectedContext } = useTeamContext();

  /**
   * Default template for new functions that provides a basic decoder structure
   */
  const defaultFunctionTemplate = `function decodeUplink(input) {
  // create the object to collect the data for returning the decoded payload
  var data = {
    "bytes": input.data, 
    "fPort" : input.fPort, 
    "fCnt": input.fCnt, 
    "deviceInfo": input.deviceInfo, 
    "gateways": input.rxInfo, 
    "deduplicationId": input.deduplicationId, 
    "time": input.time, 
    "devAddr": input.devAddr, 
    "adr": input.adr, 
    "dr": input.dr, 
    "confirmed": input.confirmed, 
  };

  return data;
}`;

  /**
   * Initializes form values based on whether we're editing an existing function
   * or creating a new one
   */
  useEffect(() => {
    if (initialFunction) {
      setName(initialFunction.name);
      setCode(initialFunction.code || defaultFunctionTemplate);
      setDescription(initialFunction.description || '');
    } else {
      // Reset form when creating new function
      setName('');
      setCode(defaultFunctionTemplate);
      setDescription('');
    }
  }, [initialFunction, defaultFunctionTemplate]);

  /**
   * Mutation for creating a new function
   */
  const createMutation = useStandardCreateMutation<CustomFunction, Partial<CustomFunction>>(
    queryKeys.functions,
    (data) => {
      const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
      return functionService.createFunction(
        {
          name: data.name!,
          code: data.code!,
          description: data.description,
          status: 'pending',
        },
        teamId
      );
    },
    {
      onError: (err) => {
        setError(t('functions.errorSaving'));
        toast.error(`${t('functions.errorSaving')}: ${err.message}`);
      },
    }
  );

  /**
   * Mutation for updating an existing function
   */
  const updateMutation = useStandardUpdateMutation<CustomFunction, Partial<CustomFunction>>(
    queryKeys.functions,
    (id, data) => functionService.updateFunction(id, data),
    {
      onError: (err) => {
        setError(t('functions.errorSaving'));
        toast.error(`${t('functions.errorSaving')}: ${err.message}`);
      },
    }
  );

  /**
   * Handles form submission for creating or updating a function.
   * Validates the form data, then calls the appropriate mutation based on
   * whether we're creating a new function or updating an existing one.
   * 
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('functions.errorNameRequired'));
      return;
    }

    setError(null);

    if (initialFunction) {
      // Update existing function
      updateMutation.mutate({
        id: initialFunction.id,
        updates: {
          name,
          code,
          description,
        }
      });
      toast.success(t('functions.functionUpdated', { name }));
      onClose();
    } else {
      // Create new function
      createMutation.mutate({
        name,
        code,
        description,
      });
      toast.success(t('functions.functionCreated', { name }));
      onClose();
    }
  }, [name, code, description, initialFunction, createMutation, updateMutation, t, onClose, toast]);

  /**
   * Returns all state variables and handlers needed for the function editor modal component.
   */
  return {
    /** The name of the function */
    name,
    /** Function to update the name */
    setName,
    /** The code content of the function */
    code,
    /** Function to update the code content */
    setCode,
    /** The description of the function */
    description,
    /** Function to update the description */
    setDescription,
    /** Form submission handler */
    handleSubmit,
    /** Current error message, if any */
    error,
    /** Function to update the error state */
    setError,
    /** Whether a submission is currently in progress */
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    /** The default template used for new functions */
    defaultFunctionTemplate
  };
};