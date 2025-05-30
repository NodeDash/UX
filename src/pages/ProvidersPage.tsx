import React from "react";
import { PageContainer, PageHeader } from "@/components/ui/index";
import ProvidersTable from "@/components/tables/ProvidersTable";
import { IconBuildingStore } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

/**
 * Main page for managing service providers
 */
const ProvidersPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <PageHeader
        title={t("providers.title")}
        icon={<IconBuildingStore className="text-blue-600" size={24} />}
      />
      <ProvidersTable />
    </PageContainer>
  );
};

export default ProvidersPage;
