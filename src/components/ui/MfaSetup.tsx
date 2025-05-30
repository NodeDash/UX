import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "./loading-spinner";

interface MfaSetupProps {
  onComplete?: () => void;
}

export const MfaSetup: React.FC<MfaSetupProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const {
    setupMfa,
    verifyAndEnableMfa,
    mfaSetupData,
    clearMfaSetup,
    error,
    mfaLoading,
  } = useAuth();

  const [step, setStep] = useState<"initial" | "verify">("initial");
  const [verificationCode, setVerificationCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // Combined loading state
  const isLoading = mfaLoading || localLoading;

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      clearMfaSetup();
    };
  }, [clearMfaSetup]);

  useEffect(() => {
    if (mfaSetupData) {
      if (mfaSetupData.qrcode) {
        setQrCodeUrl(mfaSetupData.qrcode);
      }
    }
  }, [mfaSetupData]);

  const handleSetup = async () => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      await setupMfa();
      setStep("verify");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to setup MFA");
      console.error("MFA setup error in component:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      if (!verificationCode.trim() || verificationCode.length !== 6) {
        setLocalError(t("auth.mfaCodeLength"));
        setLocalLoading(false);
        return;
      }

      const success = await verifyAndEnableMfa(verificationCode);
      if (success) {
        if (onComplete) {
          onComplete();
        }
      }
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Failed to verify MFA code"
      );
    } finally {
      setLocalLoading(false);
    }
  };

  const renderInitialStep = () => (
    <div className="text-center space-y-4">
      <h3 className="text-lg font-medium">{t("auth.setupMfa")}</h3>
      <p className="text-sm">{t("auth.setupMfaDescription")}</p>
      <button
        onClick={handleSetup}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? <LoadingSpinner size="sm" /> : t("auth.setupMfa")}
      </button>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">{t("auth.scanQrCode")}</h3>
        <p className="text-sm mt-2">{t("auth.scanQrCodeDescription")}</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white p-1 rounded-md">
          <img
            src={qrCodeUrl ?? "no data"}
            alt="MFA QR Code"
            className="w-48 h-48"
          />
        </div>
      </div>

      {/* Verification input */}
      <div className="space-y-4 mt-6">
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
          onClick={handleVerify}
          disabled={isLoading || !verificationCode}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : t("auth.verifyAndEnable")}
        </button>

        <button
          onClick={() => {
            clearMfaSetup();
            setStep("initial");
          }}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          {t("common.cancel")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      {/* Error message */}
      {(error || localError) && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
          {error || localError}
        </div>
      )}

      {step === "initial" ? renderInitialStep() : renderVerifyStep()}
    </div>
  );
};

export default MfaSetup;
