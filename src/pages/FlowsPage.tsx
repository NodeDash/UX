import React from "react";
import { PageContainer, PageHeader } from "@/components/ui";
import { FlowsTable } from "@/components/tables";
import FlowHistoryTable from "@/components/tables/FlowHistoryTable";
import { IconActivityHeartbeat } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const FlowsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <PageHeader
        title={t("flows.title")}
        icon={<IconActivityHeartbeat className="text-blue-600" size={24} />}
      />
      <FlowsTable />
      <FlowHistoryTable className="mt-6" />
    </PageContainer>
  );
};

export default FlowsPage;
