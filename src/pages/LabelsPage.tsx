import React from "react";
import { PageContainer, PageHeader } from "@/components/ui";
import { LabelsTable } from "@/components/tables";
import LabelHistoryTable from "@/components/tables/LabelHistoryTable";
import { useTranslation } from "react-i18next";
import { IconTags } from "@tabler/icons-react";

const LabelsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <PageHeader
        title={t("labels.title")}
        icon={<IconTags className="text-blue-600" size={24} />}
      />
      <LabelsTable />
      <LabelHistoryTable className="mt-6" />
    </PageContainer>
  );
};

export default LabelsPage;
