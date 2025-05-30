import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "./loading-spinner";

interface MfaDisableProps {
  onComplete?: () => void;
}

export const MfaDisable: React.FC<MfaDisableProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const { disableMfa, error, isLoading } = useAuth();

  const [verificationCode, setVerificationCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDisable = async () => {
    try {
      setLocalError(null);
      if (!verificationCode.trim() || verificationCode.length !== 6) {
        setLocalError(t("auth.mfaCodeLength"));
        return;
      }

      const success = await disableMfa(verificationCode);
      if (success && onComplete) {
        onComplete();
      }
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Failed to disable MFA"
      );
    }
  };

  if (!showConfirm) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium">{t("auth.disableMfa")}</h3>
          <p className="text-sm">{t("auth.disableMfaWarning")}</p>
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {t("auth.disableMfa")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      {/* Error message */}
      {(error || localError) && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
          {error || localError}
        </div>
      )}

      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">{t("auth.confirmDisableMfa")}</h3>
          <p className="text-sm mt-2">{t("auth.enterCodeToDisable")}</p>
        </div>

        {/* Verification input */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="verification-code"
              className="block text-sm font-medium"
            >
              {t("auth.enterCodeFromApp")}
            </label>
            <input
              id="verification-code"
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))
              }
              placeholder="000000"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleDisable}
            disabled={isLoading || !verificationCode}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              t("auth.confirmDisable")
            )}
          </button>

          <button
            onClick={() => {
              setShowConfirm(false);
              setVerificationCode("");
              setLocalError(null);
            }}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MfaDisable;
