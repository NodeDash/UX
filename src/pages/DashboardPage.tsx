import React from "react";
import { useTranslation } from "react-i18next";
import { PageContainer, PageHeader } from "@/components/ui";
import { IconDashboard } from "@tabler/icons-react";
import {
  DashboardStatsGrid,
  DashboardHistoryTabs,
} from "@/components/ui/dashboard";
import { useAuth } from "@/context/AuthContext";
import { useTeamContext } from "@/context/TeamContext";

/**
 * Dashboard page displaying system statistics and metrics
 */
const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { selectedContext } = useTeamContext();
  const { user } = useAuth();

  const getLabel = () => {
    if (selectedContext.type === "team") return selectedContext.team.name;
    return user?.email || t("common.user");
  };

  return (
    <PageContainer>
      <PageHeader
        title={t("dashboard.title", { owner: getLabel() })}
        icon={<IconDashboard className="text-blue-600" size={24} />}
      />

      {/* Stats Cards Grid - now handles its own data fetching */}
      <DashboardStatsGrid />

      {/* History Tabs */}
      <DashboardHistoryTabs />
    </PageContainer>
  );
};

export default DashboardPage;
