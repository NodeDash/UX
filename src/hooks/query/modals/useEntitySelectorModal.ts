import { useState, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';

/**
 * Props for the useEntitySelectorModal hook
 */
interface UseEntitySelectorModalProps<T> {
  /** List of entities to display and select from */
  entities: T[];
  /** Optional list of entity IDs that are already selected/used */
  existingEntityIds?: string[];
  /** Callback function called when an entity is selected */
  onSelect: (entity: T) => void;
}

/**
 * Hook for handling entity selection in modal interfaces
 * 
 * @template T - Entity type with id and name properties
 * @param props - Configuration for the entity selector
 * @returns Object containing entity selection state and handlers
 */
export function useEntitySelectorModal<T extends { id: string; name: string }>({ 
  entities, 
  existingEntityIds = [],
  onSelect
}: UseEntitySelectorModalProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const filteredEntities = useCallback(() => {
    return entities?.filter((entity) =>
      entity.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [entities, searchQuery]);

  const isEntityInFlow = useCallback((entityId: string): boolean => {
    return existingEntityIds.includes(entityId);
  }, [existingEntityIds]);

  const handleSelectEntity = useCallback((entity: T) => {
    if (!isEntityInFlow(entity.id)) {
      onSelect(entity);
    }
  }, [isEntityInFlow, onSelect]);

  return {
    searchQuery,
    setSearchQuery,
    filteredEntities: filteredEntities(),
    isEntityInFlow,
    handleSelectEntity,
    isDarkMode
  };
}