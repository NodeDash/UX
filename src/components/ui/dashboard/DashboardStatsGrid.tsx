import React from "react";
import { useTranslation } from "react-i18next";
import {
  IconDevices,
  IconActivityHeartbeat,
  IconCode,
  IconPlugConnected,
  IconCircleCheck,
  IconCircleX,
  IconClock,
} from "@tabler/icons-react";
import {
  StatsCard,
  StatsCardItem,
  ChartDataItem,
} from "@/components/ui/dashboard";
import { useDashboard } from "@/hooks/api";
import { LoadingSpinner, ErrorMessage } from "@/components/ui";

const DashboardStatsGrid: React.FC = () => {
  const { t } = useTranslation();

  // Fetch all dashboard stats in a single API call
  const { data: dashboardStats, isLoading, error } = useDashboard();

  // Extract stats from the response or use default empty values if data is not loaded yet
  const deviceStats = dashboardStats?.deviceStats || {
    total: 0,
    online: 0,
    offline: 0,
    neverSeen: 0,
    maintenance: 0,
  };

  const flowStats = dashboardStats?.flowStats || {
    total: 0,
    success: 0,
    error: 0,
    partialSuccess: 0,
    pending: 0,
    inactive: 0,
  };

  const functionStats = dashboardStats?.functionStats || {
    total: 0,
    active: 0,
    error: 0,
    inactive: 0,
  };

  const integrationStats = dashboardStats?.integrationStats || {
    total: 0,
    active: 0,
    inactive: 0,
    error: 0,
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return <ErrorMessage message={t("dashboard.errorLoading")} />;
  }

  // Prepare data for device stats pie chart
  const deviceChartData: ChartDataItem[] = [
    { name: "Online", value: deviceStats.online, color: "#16a34a" }, // green-600
    { name: "Offline", value: deviceStats.offline, color: "#dc2626" }, // red-600
    { name: "Never Seen", value: deviceStats.neverSeen, color: "#71717a" }, // gray-500
    { name: "Maintenance", value: deviceStats.maintenance, color: "#d97706" }, // amber-600
  ];

  // Prepare data for flow stats pie chart
  const flowChartData: ChartDataItem[] = [
    { name: "Success", value: flowStats.success, color: "#16a34a" }, // green-600
    { name: "Error", value: flowStats.error, color: "#dc2626" }, // red-600
    {
      name: "Partial Success",
      value: flowStats.partialSuccess,
      color: "#d97706",
    }, // amber-600
    { name: "Inactive", value: flowStats.inactive, color: "#71717a" }, // gray-500
  ];

  // Prepare data for function stats pie chart
  const functionChartData: ChartDataItem[] = [
    { name: "Active", value: functionStats.active, color: "#16a34a" }, // green-600
    { name: "Error", value: functionStats.error, color: "#dc2626" }, // red-600
    { name: "Inactive", value: functionStats.inactive, color: "#71717a" }, // gray-500
  ];

  // Prepare data for integration stats pie chart
  const integrationChartData: ChartDataItem[] = [
    { name: "Active", value: integrationStats.active, color: "#16a34a" }, // green-600
    { name: "Error", value: integrationStats.error, color: "#dc2626" }, // red-600
    { name: "Inactive", value: integrationStats.inactive, color: "#71717a" }, // gray-500
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {/* Device Status Card */}
      <StatsCard
        title={t("dashboard.deviceStatus")}
        icon={<IconDevices className="h-full w-full" />}
        chartData={deviceChartData}
      >
        <StatsCardItem
          title={t("dashboard.onlineDevices")}
          subtitle={t("dashboard.devicesCurrentlyConnected")}
          value={deviceStats.online}
          icon={<IconCircleCheck className="h-full w-full" strokeWidth={1.5} />}
          color="green"
        />
        <StatsCardItem
          title={t("dashboard.offlineDevices")}
          subtitle={t("dashboard.devicesCurrentlyDisconnected")}
          value={deviceStats.offline}
          icon={<IconCircleX className="h-full w-full" strokeWidth={1.5} />}
          color="red"
        />
        <StatsCardItem
          title={t("dashboard.neverSeenDevices")}
          subtitle={t("dashboard.devicesNeverConnected")}
          value={deviceStats.neverSeen}
          icon={<IconClock className="h-full w-full" strokeWidth={1.5} />}
          color="gray"
          removePaddingBottom
        />
      </StatsCard>

      {/* Flow Status Card */}
      <StatsCard
        title={t("dashboard.flowStatus")}
        icon={<IconActivityHeartbeat className="h-full w-full" />}
        chartData={flowChartData}
      >
        <StatsCardItem
          title={t("dashboard.successfulFlows")}
          subtitle={t("dashboard.flowsRunningWithoutErrors")}
          value={flowStats.success}
          icon={<IconCircleCheck className="h-full w-full" strokeWidth={1.5} />}
          color="green"
        />
        <StatsCardItem
          title={t("dashboard.flowsWithErrors")}
          subtitle={t("dashboard.flowNeedingAttention")}
          value={flowStats.error}
          icon={<IconCircleX className="h-full w-full" strokeWidth={1.5} />}
          color="red"
        />
        <StatsCardItem
          title={t("dashboard.inactiveFlows")}
          subtitle={t("dashboard.flowsWithoutHistory")}
          value={flowStats.inactive}
          icon={<IconClock className="h-full w-full" strokeWidth={1.5} />}
          color="gray"
          removePaddingBottom
        />
      </StatsCard>

      {/* Function Stats */}
      <StatsCard
        title={t("dashboard.functionStats")}
        icon={<IconCode className="h-full w-full" />}
        chartData={functionChartData}
      >
        <StatsCardItem
          title={t("dashboard.successfulFunctions")}
          subtitle={t("dashboard.functionsRunningWithoutErrors")}
          value={functionStats.active}
          icon={<IconCircleCheck className="h-full w-full" strokeWidth={1.5} />}
          color="green"
        />
        <StatsCardItem
          title={t("dashboard.functionsWithErrors")}
          subtitle={t("dashboard.functionsNeedingAttention")}
          value={functionStats.error}
          icon={<IconCircleX className="h-full w-full" strokeWidth={1.5} />}
          color="red"
        />
        <StatsCardItem
          title={t("dashboard.inactiveFunctions")}
          subtitle={t("dashboard.functionsNotUsed")}
          value={functionStats.inactive}
          icon={<IconClock className="h-full w-full" strokeWidth={1.5} />}
          color="gray"
          removePaddingBottom
        />
      </StatsCard>

      {/* Integration Stats */}
      <StatsCard
        title={t("dashboard.integrationStats")}
        icon={<IconPlugConnected className="h-full w-full" />}
        chartData={integrationChartData}
      >
        <StatsCardItem
          title={t("dashboard.successfulIntegrations")}
          subtitle={t("dashboard.integrationsRunningWithoutErrors")}
          value={integrationStats.active}
          icon={<IconCircleCheck className="h-full w-full" strokeWidth={1.5} />}
          color="green"
        />
        <StatsCardItem
          title={t("dashboard.integrationsWithErrors")}
          subtitle={t("dashboard.integrationsNeedingAttention")}
          value={integrationStats.error}
          icon={<IconCircleX className="h-full w-full" strokeWidth={1.5} />}
          color="red"
        />
        <StatsCardItem
          title={t("dashboard.inactiveIntegrations")}
          subtitle={t("dashboard.integrationsNoHistory")}
          value={integrationStats.inactive}
          icon={<IconClock className="h-full w-full" strokeWidth={1.5} />}
          color="gray"
          removePaddingBottom
        />
      </StatsCard>
    </div>
  );
};

export default DashboardStatsGrid;
