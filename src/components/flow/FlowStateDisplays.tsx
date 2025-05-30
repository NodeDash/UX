import React from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../ui";

interface FlowErrorDisplayProps {
  message: string;
}

/**
 * Display for flow loading error
 */
export const FlowErrorDisplay: React.FC<FlowErrorDisplayProps> = ({
  message,
}) => {
  const { t } = useTranslation();

  return (
    <div className="page-container w-full h-full flex items-center justify-center">
      <div className="text-center p-6 max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 9 0 11-18 0 9 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {t("flows.errorLoadingFlow")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
      </div>
    </div>
  );
};

/**
 * Display for flow loading state
 */
export const FlowLoadingDisplay: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container w-full h-full">
      <LoadingSpinner size="lg" message={t("flows.loadingFlow")} fullPage />
    </div>
  );
};
