import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Component to show while the flow is loading
 */
const FlowLoadingDisplay: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-md p-6 bg-card rounded-lg shadow-lg border border-border text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">{t("flows.loadingFlow")}</h2>
        <p className="text-muted-foreground text-sm">
          {t("common.pleaseWait")}
        </p>
      </div>
    </div>
  );
};

export default FlowLoadingDisplay;
