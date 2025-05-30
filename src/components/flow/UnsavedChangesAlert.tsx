import React from "react";
import { useTranslation } from "react-i18next";

type UnsavedChangesAlertProps = {
  onSave: () => void;
  isSaving: boolean;
  isMobile?: boolean | undefined;
};

/**
 * Alert banner to show when flow has unsaved changes
 */
const UnsavedChangesAlert: React.FC<UnsavedChangesAlertProps> = ({
  onSave,
  isSaving,
  isMobile = false,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`absolute ${
        isMobile ? "bottom-6" : "top-6"
      } left-1/2 transform -translate-x-1/2 z-10 bg-yellow-100 dark:bg-yellow-900 px-4 py-2 rounded-md shadow-md border border-yellow-300 dark:border-yellow-700 flex items-center gap-2 transition-opacity duration-300 opacity-90 hover:opacity-100`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-yellow-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-sm text-yellow-800 dark:text-yellow-200">
        {t("flows.unsavedChanges")}
      </span>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="ml-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isSaving ? t("common.saving") : t("common.save")}
      </button>
    </div>
  );
};

export default UnsavedChangesAlert;
