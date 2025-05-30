import React from "react";
import { useTranslation } from "react-i18next";
import { PageContainer, PageHeader } from "../components/ui";
import TeamsTable from "@/components/tables/TeamsTable";
import { IconUsers } from "@tabler/icons-react";

const TeamsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <PageHeader
        title={t("teams.title")}
        icon={<IconUsers className="text-blue-600" size={24} />}
      />
      <TeamsTable className="mt-4" />
    </PageContainer>
  );
};

export default TeamsPage;
