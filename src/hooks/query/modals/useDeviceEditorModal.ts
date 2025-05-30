import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTeamContext } from '@/context/TeamContext';
import { Device } from '@/types/device.types';
import { Label } from '@/types/label.types';
import { useToast } from '@/hooks/ux/useToast';
import { useTheme } from '@/context/ThemeContext';
import { labelService } from '@/services/label.service';
import { deviceService } from '@/services/device.service';
import { 
  useStandardQuery, 
  useStandardCreateMutation, 
  useStandardUpdateMutation, 
  DataPriority 
} from '../queryUtils';
import { queryKeys } from '../queryKeys';

/**
 * Props for the useDeviceEditorModal hook
 */
interface UseDeviceEditorModalProps {
  /** Device to edit, or undefined/null when creating a new device */
  deviceToEdit?: Device | null;
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * Hook that manages device creation and editing functionality
 * 
 * @param props - Properties containing the device to edit and close callback
 * @returns State and handlers for the device editor modal
 */
export const useDeviceEditorModal = ({ 
  deviceToEdit,
}: UseDeviceEditorModalProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { theme } = useTheme();
  const { selectedContext } = useTeamContext();
  
  // Form state
  const [name, setName] = useState('');
  const [dev_eui, setDev_eui] = useState('');
  const [app_eui, setAppEui] = useState('');
  const [app_key, setAppKey] = useState('');
  const [region, setRegion] = useState<'EU868' | 'US915' | 'AU915' | 'AS923'>('EU868');
  const [is_class_c, setIsClassC] = useState(false);
  const [originalAppKey, setOriginalAppKey] = useState('');
  const [isAppKeyVisible, setIsAppKeyVisible] = useState(false);
  const [isAppKeyEditable, setIsAppKeyEditable] = useState(false);
  const [expected_transmit_time, setExpectedTransmitTime] = useState<number>(60);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [dev_euiError, setDev_euiError] = useState<string | null>(null);
  const [app_euiError, setAppEuiError] = useState<string | null>(null);
  const [app_keyError, setAppKeyError] = useState<string | null>(null);

  const isEditMode = !!deviceToEdit;

  // Define transmitTimeOptions outside of the component logic
  const transmitTimeOptions = [
    { value: 1, label: "1 minute" },
    { value: 2, label: "2 minutes" },
    { value: 3, label: "3 minutes" },
    { value: 4, label: "4 minutes" },
    { value: 5, label: "5 minutes" },
    { value: 10, label: "10 minutes" },
    { value: 15, label: "15 minutes" },
    { value: 20, label: "20 minutes" },
    { value: 25, label: "25 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 35, label: "35 minutes" },
    { value: 40, label: "40 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 50, label: "50 minutes" },
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
    { value: 180, label: "3 hours" },
    { value: 240, label: "4 hours" },
    { value: 300, label: "5 hours" },
    { value: 360, label: "6 hours" },
    { value: 480, label: "8 hours" },
    { value: 720, label: "12 hours" },
    { value: 1440, label: "24 hours" },
  ];

  // Use TanStack Query for labels fetching
  const {
    data: labels = [],
    isLoading: isLoadingLabels,
  } = useStandardQuery<Label[]>(
    queryKeys.labels.all,
    () => labelService.getLabels(selectedContext.type === 'team' ? selectedContext.team.id : undefined),
    DataPriority.LOW, // Using DataPriority enum instead of object
    {} // Move any additional options to a separate parameter
  );

  // Create device mutation
  const createMutation = useStandardCreateMutation<Device, Partial<Device>>(
    queryKeys.devices,
    (data) => {
      const teamId = selectedContext.type === 'team' ? selectedContext.team.id : undefined;
      return deviceService.createDevice(
        {
          name: data.name!,
          dev_eui: data.dev_eui!,
          app_eui: data.app_eui!,
          app_key: data.app_key!,
          region: data.region!,
          is_class_c: data.is_class_c!,
          label_ids: data.label_ids!,
          expected_transmit_time: data.expected_transmit_time!
        },
        teamId
      );
    },
    {
      onError: (error: Error) => {
        setError(error instanceof Error ? error.message : t('devices.failedToSaveDevice'));
        toast.error(error instanceof Error ? error.message : t('devices.failedToSaveDevice'));
      },
     
    }
  );

  // Update device mutation
  const updateMutation = useStandardUpdateMutation<Device, Partial<Device>>(
    queryKeys.devices,
    (id, data) => deviceService.updateDevice(id, data),
    {
      onError: (error: Error) => {
        setError(error instanceof Error ? error.message : t('devices.failedToSaveDevice'));
        toast.error(error instanceof Error ? error.message : t('devices.failedToSaveDevice'), {
          position: 'top-right',
          autoClose: 3000,
          theme: theme,
        });
      },
      
    }
  );

  // Initialize form with existing device data when editing
  useEffect(() => {
    // Reset AppKey visibility and edit state
    setIsAppKeyVisible(false);
    setIsAppKeyEditable(false);

    // If we have a device to edit, populate the form with its values
    if (deviceToEdit) {
      setName(deviceToEdit.name);
      setDev_eui(deviceToEdit.dev_eui);
      setAppEui(deviceToEdit.app_eui);
      setAppKey(deviceToEdit.app_key || '');
      setOriginalAppKey(deviceToEdit.app_key || '');
      setExpectedTransmitTime(deviceToEdit.expected_transmit_time || 60);
      setRegion(deviceToEdit.region || 'EU868');
      setIsClassC(deviceToEdit.is_class_c || false);

      // Handle label ids
      const labelIds = deviceToEdit.label_ids
        ? deviceToEdit.label_ids.map((id) => (typeof id === 'string' ? parseInt(id, 10) : id))
        : [];
      setSelectedLabels(labelIds as number[]);
    } else {
      // Reset form for new device creation
      setName('');
      setDev_eui('');
      setAppEui('');
      setAppKey('');
      setOriginalAppKey('');
      setExpectedTransmitTime(60);
      setRegion('EU868');
      setIsClassC(false);
      setSelectedLabels([]);
    }

    setError(null);
    setNameError(null);
    setDev_euiError(null);
    setAppEuiError(null);
    setAppKeyError(null);
  }, [deviceToEdit]);

  const validateHexString = useCallback((value: string, length: number): boolean => {
    const hexRegex = new RegExp(`^[0-9A-Fa-f]{${length}}$`);
    return hexRegex.test(value);
  }, []);

  const toggleAppKeyVisibility = useCallback(() => {
    setIsAppKeyVisible(prev => !prev);
  }, []);

  const toggleAppKeyEditable = useCallback((value: boolean) => {
    setIsAppKeyEditable(value);
    if (value) {
      setAppKey(''); // Clear the field when starting to edit
    }
  }, []);

  const toggleLabelSelection = useCallback((labelId: number) => {
    setSelectedLabels(prev => {
      if (prev.includes(labelId)) {
        return prev.filter(id => id !== labelId);
      } else {
        return [...prev, labelId];
      }
    });
  }, []);

  const handleSave = useCallback(() => {
    let hasError = false;

    // Validate name field
    if (!name.trim()) {
      setNameError(t('devices.enterDeviceName'));
      hasError = true;
    } else {
      setNameError(null);
    }

    // Validate DevEUI (8 bytes/16 hex chars)
    if (!dev_eui.trim()) {
      setDev_euiError(t('devices.enterDev_eui'));
      hasError = true;
    } else if (!validateHexString(dev_eui, 16)) {
      setDev_euiError(t('devices.invalidDev_eui'));
      hasError = true;
    } else {
      setDev_euiError(null);
    }

    // Validate AppEUI (8 bytes/16 hex chars)
    if (!app_eui.trim()) {
      setAppEuiError(t('devices.enterAppEui'));
      hasError = true;
    } else if (!validateHexString(app_eui, 16)) {
      setAppEuiError(t('devices.invalidAppEui'));
      hasError = true;
    } else {
      setAppEuiError(null);
    }

    // For new devices, require AppKey
    // For editing, only validate if provided and in edit mode
    if (!isEditMode || isAppKeyEditable) {
      if (!isEditMode && !app_key.trim()) {
        setAppKeyError(t('devices.enterAppKey'));
        hasError = true;
      } else if (app_key.trim() && !validateHexString(app_key, 32)) {
        setAppKeyError(t('devices.invalidAppKey'));
        hasError = true;
      } else {
        setAppKeyError(null);
      }
    }

    if (hasError) {
      return;
    }

    setError(null);

    // Determine which AppKey to send
    let finalAppKey = app_key;

    // In edit mode, handle the AppKey properly
    if (isEditMode) {
      if (!isAppKeyEditable) {
        // If not in edit mode for AppKey, keep the original AppKey
        finalAppKey = originalAppKey;
      } else if (!app_key.trim()) {
        // If editing but left blank, keep the original AppKey
        finalAppKey = originalAppKey;
      } else if (app_key === originalAppKey) {
        // If same as original, use original (no change)
        finalAppKey = originalAppKey;
      }
      // Otherwise, use the new AppKey (already in finalAppKey)
    }

    if (isEditMode && deviceToEdit) {
      // Update existing device
      updateMutation.mutate({
        id: deviceToEdit.id,
        updates: {
          name,
          dev_eui,
          app_eui,
          app_key: finalAppKey,
          region,
          is_class_c,
          label_ids: selectedLabels,
          expected_transmit_time
        }
      });
    } else {
      // Create new device
      createMutation.mutate({
        name,
        dev_eui,
        app_eui,
        app_key: finalAppKey,
        region,
        is_class_c,
        label_ids: selectedLabels,
        expected_transmit_time
      });
    }
  }, [
    name, dev_eui, app_eui, app_key, region, is_class_c, selectedLabels, expected_transmit_time,
    isEditMode, deviceToEdit, originalAppKey, isAppKeyEditable, t, validateHexString,
    createMutation, updateMutation
  ]);

  return {
    name,
    setName,
    dev_eui,
    setDev_eui,
    app_eui,
    setAppEui,
    app_key,
    setAppKey,
    region,
    setRegion,
    is_class_c,
    setIsClassC,
    originalAppKey,
    isAppKeyVisible,
    isAppKeyEditable,
    expected_transmit_time,
    setExpectedTransmitTime,
    labels,
    selectedLabels,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isLoadingLabels,
    error,
    nameError,
    dev_euiError,
    app_euiError,
    app_keyError,
    transmitTimeOptions,
    toggleAppKeyVisibility,
    toggleAppKeyEditable,
    toggleLabelSelection,
    handleSave,
    isEditMode
  };
};