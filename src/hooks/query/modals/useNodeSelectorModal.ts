import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';

type NodeType = "device" | "function" | "integration" | "label";

interface UseNodeSelectorModalProps {
  onSelectNodeType: (type: NodeType) => void;
}

/**
 * Hook providing data and handlers for the node selector modal
 * 
 * @param props - Properties containing callback for node type selection
 * @returns Object with node types data, theme information, and handler function
 */
export function useNodeSelectorModal({ onSelectNodeType }: UseNodeSelectorModalProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const nodeTypes = [
    { id: "device" as NodeType, name: t("devices.title"), icon: "computer-classic" },
    { id: "function" as NodeType, name: t("functions.title"), icon: "code" },
    { id: "integration" as NodeType, name: t("integrations.title"), icon: "plug" },
    { id: "label" as NodeType, name: t("labels.title"), icon: "tag" },
  ];

  /**
   * Handler for node type selection
   * 
   * @param type - The selected node type 
   */
  const handleSelectNodeType = useCallback((type: NodeType) => {
    onSelectNodeType(type);
  }, [onSelectNodeType]);

  return {
    nodeTypes,
    isDarkMode,
    handleSelectNodeType
  };
}