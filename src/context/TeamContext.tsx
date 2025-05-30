import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { Team } from "@/types"; // Assuming Team type is available
import { queryClient } from "@/providers/QueryProvider";

// Define the shape of the context value
interface TeamContextType {
  selectedContext: { type: "user" } | { type: "team"; team: Team };
  setSelectedContext: (
    context: { type: "user" } | { type: "team"; team: Team }
  ) => void;
  isLoading: boolean; // Add loading state if needed for initial fetch
}

// Create the context with a default value
const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Define the props for the provider
interface TeamProviderProps {
  children: ReactNode;
}

// Create the provider component
export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  // Initialize state. Default to 'user' context.
  const [selectedContext, setSelectedContextState] = useState<
    { type: "user" } | { type: "team"; team: Team }
  >({ type: "user" });

  const [isLoading] = useState(false); // Example loading state

  /**
   * Sets the selected context and invalidates all React Query queries
   * if the context has actually changed.
   * @param context - The new context to set.
   */
  const setSelectedContext = useCallback(
    (context: { type: "user" } | { type: "team"; team: Team }) => {
      // Only invalidate if actually changing context
      if (
        selectedContext.type !== context.type ||
        (selectedContext.type === "team" &&
          context.type === "team" &&
          selectedContext.team.id !== context.team.id)
      ) {
        // Set the new context
        setSelectedContextState(context);

        // Invalidate all queries to fetch fresh data for the new team
        queryClient.invalidateQueries();
      } else {
        // Context hasn't actually changed, just set it without invalidating
        setSelectedContextState(context);
      }
    },
    [selectedContext]
  );

  /**
   * Memoized context value to prevent unnecessary re-renders of consumers
   * when the provider's parent re-renders.
   */
  const value = useMemo(
    () => ({
      selectedContext,
      setSelectedContext,
      isLoading,
    }),
    [selectedContext, setSelectedContext, isLoading]
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

/**
 * Custom hook to consume the TeamContext.
 * This hook provides an easy way to access the team context values.
 * It throws an error if used outside of a {@link TeamProvider}.
 * @returns {TeamContextType} The team context values.
 * @throws {Error} If the hook is not used within a TeamProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useTeamContext = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeamContext must be used within a TeamProvider");
  }
  return context;
};
