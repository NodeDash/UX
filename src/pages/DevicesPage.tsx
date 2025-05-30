import React from "react";
import DeviceHistoryTable from "@/components/tables/DeviceHistoryTable";
import { DevicesTable } from "@/components/tables";
import { PageContainer, PageHeader } from "@/components/ui";
import { IconDevices } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const DevicesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <PageHeader
        title={t("devices.title")}
        icon={<IconDevices className="text-blue-600" size={24} />}
      />
      <DevicesTable />
      <DeviceHistoryTable className="mt-6" />
    </PageContainer>
  );
};

export default DevicesPage;
