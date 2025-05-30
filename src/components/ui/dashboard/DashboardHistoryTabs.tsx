import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconHistory } from "@tabler/icons-react";
import DeviceHistoryTable from "@/components/tables/DeviceHistoryTable";
import FlowHistoryTable from "@/components/tables/FlowHistoryTable";
import FunctionHistoryTable from "@/components/tables/FunctionHistoryTable";
import IntegrationHistoryTable from "@/components/tables/IntegrationHistoryTable";

type HistoryTab = "devices" | "flows" | "functions" | "integrations";

const DashboardHistoryTabs: React.FC = () => {
  const { t } = useTranslation();
  const [activeHistoryTab, setActiveHistoryTab] =
    useState<HistoryTab>("devices");

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <IconHistory className="text-blue-600" size={24} />
        <h2 className="text-2xl font-semibold">{t("history.systemHistory")}</h2>
      </div>

      {/* Tabbed Navigation */}
      <div className="border-b border-gray-700 mb-4">
        <nav className="-mb-px flex" aria-label="History navigation">
          <button
            onClick={() => setActiveHistoryTab("devices")}
            className={`mr-8 py-3 border-b-2 font-medium text-sm ${
              activeHistoryTab === "devices"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500"
            }`}
          >
            {t("devices.deviceHistory")}
          </button>
          <button
            onClick={() => setActiveHistoryTab("flows")}
            className={`mr-8 py-3 border-b-2 font-medium text-sm ${
              activeHistoryTab === "flows"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500"
            }`}
          >
            {t("flows.flowHistory")}
          </button>
          <button
            onClick={() => setActiveHistoryTab("functions")}
            className={`mr-8 py-3 border-b-2 font-medium text-sm ${
              activeHistoryTab === "functions"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500"
            }`}
          >
            {t("functions.functionHistory")}
          </button>
          <button
            onClick={() => setActiveHistoryTab("integrations")}
            className={`mr-8 py-3 border-b-2 font-medium text-sm ${
              activeHistoryTab === "integrations"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500"
            }`}
          >
            {t("integrations.integrationHistory")}
          </button>
        </nav>
      </div>

      {/* Show the active history table */}
      {activeHistoryTab === "devices" && <DeviceHistoryTable />}
      {activeHistoryTab === "flows" && <FlowHistoryTable />}
      {activeHistoryTab === "functions" && <FunctionHistoryTable />}
      {activeHistoryTab === "integrations" && <IntegrationHistoryTable />}
    </div>
  );
};

export default DashboardHistoryTabs;
