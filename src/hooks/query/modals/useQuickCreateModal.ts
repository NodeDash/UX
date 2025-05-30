import { useState, useCallback } from 'react';

type EditorType = 'device' | 'function' | 'integration' | 'label' | 'flow' | null;

/**
 * Props for the useQuickCreateModal hook
 */
interface UseQuickCreateModalProps {
  /** Callback to close the quick create modal */
  onClose: () => void;
}

/**
 * Hook to manage the quick create modal state and entity type selection
 * 
 * @param props - Properties containing the close callback
 * @returns Object containing modal state and handlers
 */
export function useQuickCreateModal({ onClose }: UseQuickCreateModalProps) {
  const [activeEditor, setActiveEditor] = useState<EditorType>(null);

  /**
   * Selects an editor type to display
   * 
   * @param type - The type of entity editor to show
   */
  const handleEditorSelect = useCallback((type: EditorType) => {
    setActiveEditor(type);
  }, []);

  /**
   * Closes the currently active editor without closing the main modal
   */
  const handleEditorClose = useCallback(() => {
    setActiveEditor(null);
  }, []);

  /**
   * Closes both the active editor and the main modal
   */
  const handleMainClose = useCallback(() => {
    setActiveEditor(null);
    onClose();
  }, [onClose]);

  return {
    activeEditor,
    handleEditorSelect,
    handleEditorClose,
    handleMainClose
  };
}