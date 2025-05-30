import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface FlowErrorDisplayProps {
  message?: string;
}

/**
 * Component to show when there's an error loading the flow
 */
const FlowErrorDisplay: React.FC<FlowErrorDisplayProps> = ({ message }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-md p-6 bg-card rounded-lg shadow-lg border border-border text-center">
        <h2 className="text-xl font-bold text-destructive mb-4">
          {t("flows.errorLoadingFlow")}
        </h2>

        {message && (
          <p className="text-sm mb-6 p-3 bg-destructive/20 rounded border border-destructive/30">
            {message}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <Link
            to="/flows"
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            {t("flows.returnToFlows")}
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowErrorDisplay;
