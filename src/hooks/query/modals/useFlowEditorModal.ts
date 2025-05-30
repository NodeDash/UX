import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Flow } from "@/types/flow.types";
import { useToast } from "@/hooks/ux/useToast";
import { flowService } from "@/services/flow.service";
import { useTeamContext } from "@/context/TeamContext";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";

interface UseFlowEditorModalProps {
  flow?: Flow; // Optional flow for editing
  onClose: () => void;
}

export function useFlowEditorModal({ flow, onClose }: UseFlowEditorModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Get the team ID from the selected context
  const { selectedContext } = useTeamContext();
  const teamId =
    selectedContext.type === "team" ? selectedContext.team.id : undefined;

  // Reset form or populate with flow data when initialized
  useEffect(() => {
    if (flow) {
      // Editing mode - populate with existing flow data
      setName(flow.name);
      setDescription(flow.description || "");
    } else {
      // Create mode - reset form
      setName("");
      setDescription("");
    }
    setError(null);
    setNameError(null);
  }, [flow]);

  // Handle flow creation
  const handleCreateFlow = useCallback(async (name: string, description: string) => {
    try {
      await flowService.createFlow({ name, description }, teamId);
      toast.success(t("flows.flowCreated", { name }));
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.flows.all(teamId) });
      return true;
    } catch (err) {
      console.error(t("flows.errorCreating"), err);
      toast.error(t("flows.errorCreating"));
      return false;
    }
  }, [teamId, toast, t, queryClient]);

  // Handle flow update
  const handleUpdateFlow = useCallback(async (name: string, description: string) => {
    if (!flow) return false; // Ensure flow is defined
    const editingFlow = flow;

    try {
      await flowService.updateFlow(
        editingFlow.id,
        { name, description },
        teamId
      );
      toast.success(t("flows.flowUpdated", { name }));
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.flows.all(teamId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.flows.detail(editingFlow.id, teamId) });
      return true;
    } catch (err) {
      console.error(t("flows.errorUpdating"), err);
      toast.error(t("flows.errorUpdating"));
      return false;
    }
  }, [flow, teamId, toast, t, queryClient]);

  const handleSave = useCallback(async () => {
    // Validate name field
    if (!name.trim()) {
      setNameError(t("flows.enterFlowName"));
      return;
    } else {
      setNameError(null);
    }

    try {
      setIsSaving(true);
      setError(null);
      
      if (flow) {
        // Update existing flow
        const success = await handleUpdateFlow(name, description);
        if (success) onClose();
      } else {
        // Create new flow
        const success = await handleCreateFlow(name, description);
        if (success) onClose();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("flows.failedToSaveFlow")
      );
      toast.error(t("flows.errorSavingFlow"));
    } finally {
      setIsSaving(false);
    }
  }, [name, description, flow, handleCreateFlow, handleUpdateFlow, t, toast, onClose]);

  return {
    name,
    setName,
    description,
    setDescription,
    isSaving,
    error,
    nameError,
    handleSave,
    isEditMode: Boolean(flow)
  };
}