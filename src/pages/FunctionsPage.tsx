import React from "react";
import { PageContainer, PageHeader } from "@/components/ui";
import { FunctionsTable } from "@/components/tables";
import FunctionHistoryTable from "@/components/tables/FunctionHistoryTable";
import { IconCode } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const FunctionsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <PageHeader
        title={t("functions.title")}
        icon={<IconCode className="text-blue-600" size={24} />}
      />
      <FunctionsTable />
      <FunctionHistoryTable className="mt-6" />
    </PageContainer>
  );
};

export default FunctionsPage;
