import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TeamWithUsers } from "@/types";

/**
 * Props for the useTeamMembersModal hook
 */
interface UseTeamMembersModalProps {
  /** Team with users data */
  team: TeamWithUsers;
  /** Function to add a member to the team by email */
  onAddMember: (email: string) => Promise<void>;
  /** Function to remove a member from the team by user ID */
  onRemoveMember: (userId: number) => Promise<void>;
}

/**
 * Hook to manage team member additions and removals
 * 
 * @param props - Properties containing team data and member management callbacks
 * @returns Object containing state and handlers for team member management
 */
export function useTeamMembersModal({
  team,
  onAddMember,
  onRemoveMember,
}: UseTeamMembersModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState<number | null>(null);

  const { t } = useTranslation();

  /**
   * Handles adding a new member to the team
   * 
   * @param e - Optional form submission event
   */
  const handleAddMember = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }
      
      if (!email.trim()) {
        setError(t("teams.errorEmailRequired"));
        return;
      }

      try {
        setIsSubmitting(true);
        setError(null);
        await onAddMember(email);
        setEmail(""); // Clear form after adding
      } catch (err) {
        // Check if it's a 404 error (user not found)
        if (err instanceof Error) {
          const errorMessage = err.message.toLowerCase();
          if (
            errorMessage.includes("404") ||
            errorMessage.includes("not found") ||
            errorMessage.includes("user not found")
          ) {
            setError(
              t("teams.userNotFound", {
                email: email,
                defaultValue: `User "${email}" not found. Please ask them to sign up before adding them to the team.`,
              })
            );
          } else {
            setError(err.message);
          }
        } else {
          setError(t("teams.failedToAddMember"));
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, onAddMember, t]
  );

  /**
   * Handles removing a member from the team
   * 
   * @param userId - ID of the user to remove
   */
  const handleRemoveMember = useCallback(
    async (userId: number) => {
      try {
        setIsRemoving(userId);
        await onRemoveMember(userId);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t("teams.failedToRemoveMember"));
        }
      } finally {
        setIsRemoving(null);
      }
    },
    [onRemoveMember, t]
  );

  return {
    email,
    setEmail,
    error,
    setError,
    isSubmitting,
    isRemoving,
    handleAddMember,
    handleRemoveMember,
    team
  };
}