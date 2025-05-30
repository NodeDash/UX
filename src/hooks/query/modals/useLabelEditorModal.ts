import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/ux/useToast';
import { useTeamContext } from '@/context/TeamContext';
import { labelService } from '@/services/label.service';
import { 
  useStandardQuery, 
  useStandardCreateMutation, 
  useStandardUpdateMutation,
  DataPriority
} from '../queryUtils';
import { queryKeys } from '../queryKeys';
import { Label } from '@/types/label.types';
import { Device } from '@/types/device.types';
import { deviceService } from '@/services/device.service';

interface UseLabelEditorModalProps {
  initialLabel?: { id: string; name: string; device_ids?: string[] } | null;
  initialdevice_ids?: string[];
  onClose?: () => void;
  onSave?: (name: string, device_ids: string[]) => Promise<void>;
}

export const useLabelEditorModal = ({
  initialLabel = null,
  initialdevice_ids = [],
  onSave,
}: UseLabelEditorModalProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { selectedContext } = useTeamContext();
  
  // Set initial state values directly from props
  const [name, setName] = useState(initialLabel?.name || '');
  const [selecteddevice_ids, setSelecteddevice_ids] = useState<string[]>(
    initialLabel?.device_ids?.map(id => String(id)) || 
    initialdevice_ids.map(id => String(id)) || 
    []
  );
  const [error, setError] = useState<string | null>(null);
  
  // Track if we should update device selections when toggling
  const selectionsMadeRef = useRef(false);
  
  // Track the ID of the label being edited to detect real changes
  const labelIdRef = useRef<string | null>(initialLabel?.id || null);
  
  // Store onSave in a ref to avoid potential stale closures
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);
  
  const isEditMode = !!initialLabel;

  // Use TanStack Query to fetch devices
  const {
    data: devices = [],
    isLoading: isLoadingDevices
  } = useStandardQuery<Device[]>(
    queryKeys.devices.all,
    () => deviceService.getDevices(selectedContext.type === 'team' ? selectedContext.team.id : undefined),
    DataPriority.LOW, // Using DataPriority enum instead of object
    {} // Additional options as a separate parameter
  );

  // Create label mutation
  const createMutation = useStandardCreateMutation<Label, Partial<Label>>(
    queryKeys.labels,
    (data) => {
      const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
      return labelService.createLabel(
        {
          name: data.name!,
          device_ids: data.device_ids as string[]
        },
        teamId
      );
    },
    {
      onError: (err) => {
        const errorMessage = err instanceof Error ? err.message : t('labels.failedToSaveLabel');
        setError(errorMessage);
        toast.error(errorMessage);
      },
    }
  );

  // Update label mutation
  const updateMutation = useStandardUpdateMutation<Label, Partial<Label>>(
    queryKeys.labels,
    (id, data) => labelService.updateLabel(id, data),
    {
      onError: (err) => {
        const errorMessage = err instanceof Error ? err.message : t('labels.failedToSaveLabel');
        setError(errorMessage);
        toast.error(errorMessage);
      },
    }
  );

  // Update form values when initialLabel changes significantly
  useEffect(() => {
    const currentLabelId = initialLabel?.id || null;
    const previousLabelId = labelIdRef.current;
    
    // Only update form when the label ID changes (editing a different label)
    if (currentLabelId !== previousLabelId || !selectionsMadeRef.current) {
      // Update name
      if (initialLabel) {
        setName(initialLabel.name);
        
        // Only update device selections if user hasn't made changes yet
        if (!selectionsMadeRef.current) {
          const deviceIds = initialLabel.device_ids?.map(id => String(id)) || [];
          setSelecteddevice_ids(deviceIds);
        }
      } else {
        setName('');
        
        // Only update device selections if user hasn't made changes yet
        if (!selectionsMadeRef.current) {
          const deviceIds = initialdevice_ids.map(id => String(id));
          setSelecteddevice_ids(deviceIds);
        }
      }
      
      // Update label ID reference
      labelIdRef.current = currentLabelId;
      setError(null);
    }
  }, [initialLabel, initialdevice_ids]);

  // Toggle device selection
  const handleDeviceToggle = useCallback((deviceId: string) => {
    // Mark that user has made selections
    selectionsMadeRef.current = true;
    
    const stringDeviceId = String(deviceId);
    setSelecteddevice_ids((prevSelectedIds) => {
      const isSelected = prevSelectedIds.some(id => String(id) === stringDeviceId);
      
      if (isSelected) {
        return prevSelectedIds.filter(id => String(id) !== stringDeviceId);
      } else {
        return [...prevSelectedIds, stringDeviceId];
      }
    });
  }, []);

  // Handle name change
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    []
  );

  // Save label
  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      setError(t('labels.enterLabelName'));
      toast.error(t('labels.enterLabelName'));
      return;
    }

    setError(null);

    try {
      // If onSave prop is provided, use it from the ref to avoid stale closures
      if (onSaveRef.current) {
        // Wrap in a try-catch to handle errors from the parent's onSave function
        try {
          await onSaveRef.current(name, selecteddevice_ids);
        } catch (err) {
          console.error('Error in parent onSave function:', err);
          throw err; // Re-throw to be caught by the outer catch
        }
        return;
      }

      // Otherwise use our own mutations
      if (isEditMode && initialLabel) {
        // Update existing label
        updateMutation.mutate({
          id: initialLabel.id,
          updates: {
            name,
            device_ids: selecteddevice_ids
          }
        });
        toast.success(t('labels.labelUpdated', { name }));
      } else {
        // Create new label
        createMutation.mutate({
          name,
          device_ids: selecteddevice_ids
        });
        toast.success(t('labels.labelCreated', { name }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('labels.failedToSaveLabel');
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [name, selecteddevice_ids, isEditMode, initialLabel, createMutation, updateMutation, t, toast]);

  // Reset the selection tracking when the modal closes
  const handleClose = useCallback(() => {
    selectionsMadeRef.current = false;
  }, []);

  return {
    name,
    setName,
    selecteddevice_ids,
    devices,
    isLoadingDevices,
    error,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    handleDeviceToggle,
    handleNameChange,
    handleSave,
    handleClose,
    isEditMode
  };
};