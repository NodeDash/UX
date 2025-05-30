import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Team } from '@/types';
import { teamService } from '@/services/team.service';
import { useToast } from '@/hooks/ux/useToast';
import { useStandardCreateMutation, useStandardUpdateMutation } from '../queryUtils';
import { queryKeys } from '../queryKeys';

/**
 * Props for the useTeamEditorModal hook
 */
interface UseTeamEditorModalProps {
  /** Team to edit, or undefined when creating a new team */
  team?: Team;
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * Hook that manages team creation and editing functionality
 * 
 * @param props - Properties containing the team to edit and close callback
 * @returns State and handlers for the team editor modal
 */
export const useTeamEditorModal = ({
  team,
  onClose
}: UseTeamEditorModalProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!team;

  // Initialize form fields when team prop changes
  useEffect(() => {
    if (team) {
      setName(team.name || '');
      setDescription(team.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError(null);
  }, [team]);

  // Create team mutation
  const createMutation = useStandardCreateMutation<Team, Partial<Team>>(
    queryKeys.teams,
    (data) => teamService.createTeam({
      name: data.name!, 
      description: data.description
    }),
    {
      onError: (err) => {
        setError(err instanceof Error ? err.message : t('teams.createErrorFallback'));
        toast.error(err instanceof Error ? err.message : t('teams.createErrorFallback'));
      },
      
    }
  );

  // Update team mutation - making sure to convert string id to number
  const updateMutation = useStandardUpdateMutation<Team, Partial<Team>>(
    queryKeys.teams,
    (id, data) => {
      // Convert id to number if it's a string
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      return teamService.updateTeam(numericId, data);
    },
    {
      onError: (err) => {
        setError(err instanceof Error ? err.message : t('teams.updateErrorFallback'));
        toast.error(err instanceof Error ? err.message : t('teams.updateErrorFallback'));
      },
     
    }
  );

  /**
   * Handles form submission for creating or updating a team
   * 
   * @param e - Form submission event
   */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('teams.errorNameRequired'));
      return;
    }

    setError(null);

    if (isEditMode && team) {
      // Update existing team
      updateMutation.mutate({
        id: team.id,
        updates: {
          name,
          description
        }
      });
      toast.success(t('teams.teamUpdated', { name }));
      onClose();
    } else {
      // Create new team
      createMutation.mutate({
        name,
        description
      });
      toast.success(t('teams.teamCreated', { name }));
      onClose();
    }

    // Close modal after submission
  }, [name, description, isEditMode, team, createMutation, updateMutation, t, onClose, toast]);

  return {
    name,
    setName,
    description,
    setDescription,
    error,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    handleSubmit,
    isEditMode
  };
};