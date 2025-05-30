import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { teamService } from '@/services/team.service';
import { TeamCreate } from '@/types';
import { useToast } from '@/hooks/ux/useToast';

interface UseCreateTeamModalProps {
  onClose: () => void;
}

export function useCreateTeamModal({ onClose }: UseCreateTeamModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (newTeam: TeamCreate) => teamService.createTeam(newTeam),
    onSuccess: (data) => {
      toast.success(t("teams.createSuccess", { name: data.name }));
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      onClose();
      setTeamName("");
      setDescription("");
      setError(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        t("teams.createErrorFallback");
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const handleSubmit = useCallback((event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    if (!teamName.trim()) {
      setError(t("teams.errorNameRequired"));
      toast.error(t("teams.errorNameRequired"));
      return;
    }

    setError(null);
    mutation.mutate({
      name: teamName.trim(),
      description: description.trim() || undefined,
    });
  }, [teamName, description, toast, t, mutation]);

  return {
    teamName,
    setTeamName,
    description,
    setDescription,
    isSubmitting: mutation.isPending,
    error,
    handleSubmit
  };
}