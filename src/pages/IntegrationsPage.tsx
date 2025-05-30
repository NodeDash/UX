import React from "react";
import { PageContainer, PageHeader } from "@/components/ui";
import { IntegrationsTable } from "@/components/tables";
import IntegrationHistoryTable from "@/components/tables/IntegrationHistoryTable";
import { IconPlugConnected } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const IntegrationsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <PageHeader
        title={t("integrations.title")}
        icon={<IconPlugConnected className="text-blue-600" size={24} />}
      />
      <IntegrationsTable />
      <IntegrationHistoryTable className="mt-6" />
    </PageContainer>
  );
};

export default IntegrationsPage;
