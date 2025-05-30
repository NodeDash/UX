import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * VersionDisplay component shows the current version of the application
 * Useful for public testing to help testers reference which version they're using
 */
const VersionDisplay: React.FC = () => {
  const { t } = useTranslation();
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    // In a production environment, you might want to fetch this from an API endpoint
    // For now, we'll use the hardcoded version
    setVersion("0.1.0");
  }, []);

  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
      <span className="mr-1">Node Dash</span>
      <span className="mr-1">{t("common.version")}:</span>
      <span className="font-mono">{version}</span>
      <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-1.5 py-0.5 rounded">
        {t("common.testing")}
      </span>
    </div>
  );
};

export default VersionDisplay;
