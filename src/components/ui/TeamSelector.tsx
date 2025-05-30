import { useState, useEffect } from "react";
import { Team } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, PlusCircle, Users } from "lucide-react";
import { CreateTeamModal } from "../modals/CreateTeamModal";
import { useTeamContext } from "@/context/TeamContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/ux/use-mobile";
import Modal from "./Modal";
import { useTheme } from "@/context/ThemeContext";
import { useTeams } from "@/hooks/api";

export function TeamSelector() {
  const { t } = useTranslation();
  const { selectedContext, setSelectedContext } = useTeamContext();
  const { user } = useAuth(); // Get the user from AuthContext
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const navigate = useNavigate();

  const { data: teams, isLoading, error } = useTeams();

  useEffect(() => {
    // Optional: Handle external context changes
  }, [selectedContext]);

  const handleSelect = (team: Team | null) => {
    if (team) {
      setSelectedContext({ type: "team", team });
    } else {
      setSelectedContext({ type: "user" });
    }

    //if the page is not / we need to redirect to /
    if (window.location.pathname !== "/") {
      navigate("/");
    }

    // Close the modal if it's open
    if (isTeamModalOpen) {
      setIsTeamModalOpen(false);
    }
  };

  const handleCreateTeamClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const getButtonLabel = () => {
    if (isLoading) return t("common.loading");
    if (error) return t("common.error");
    if (selectedContext.type === "team") return selectedContext.team.name;
    return user?.email || t("common.user"); // Show email or fallback to generic text
  };

  // If mobile, render a simple button with a team icon that opens a modal
  if (isMobile) {
    return (
      <>
        <Button
          size="icon"
          onClick={() => setIsTeamModalOpen(true)}
          title={t("teams.selectTeam")}
          aria-label={t("teams.selectTeam")}
        >
          <Users className="h-5 w-5" />
        </Button>

        <Modal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          title={t("teams.selectTeam")}
          width="sm"
        >
          <div className="space-y-2">
            <div
              className={`flex items-center p-2 rounded-md cursor-pointer  ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(null)}
            >
              <span className="font-medium">
                {user?.email || t("common.user")}
              </span>
            </div>

            <div className="border-t dark:border-gray-700 my-2"></div>

            {teams?.map((team) => (
              <div
                key={team.id}
                className={`flex items-center p-2 rounded-md cursor-pointer  ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
                onClick={() => handleSelect(team)}
              >
                <span className="font-medium">{team.name}</span>
              </div>
            ))}

            <div className="border-t dark:border-gray-700 my-2"></div>

            <div
              className={`flex items-center p-2 rounded-md cursor-pointer  ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
              onClick={handleCreateTeamClick}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>{t("teams.createTeamMenuItem")}</span>
            </div>
          </div>
        </Modal>

        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
        />
      </>
    );
  }

  // Default desktop dropdown UI
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex justify-between items-center gap-1 min-w-[200px]"
          >
            <span>{getButtonLabel()}</span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuItem
            onSelect={() => handleSelect(null)}
            disabled={isLoading || !!error}
          >
            {user?.email || t("common.user")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {teams?.map((team) => (
            <DropdownMenuItem
              key={team.id}
              onSelect={() => handleSelect(team)}
              disabled={isLoading || !!error}
            >
              {team.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleCreateTeamClick}
            disabled={isLoading}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("teams.createTeamMenuItem")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateTeamModal isOpen={isCreateModalOpen} onClose={handleCloseModal} />
    </>
  );
}
