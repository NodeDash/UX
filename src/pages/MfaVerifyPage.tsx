import React, { useState, useEffect, useRef } from "react";
import { Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import AuthErrorMessage from "@/components/ui/auth-error-message";
import { LoadingSpinner } from "@/components/ui";

/**
 * MFA Verification Page component for two-factor authentication
 */
export default function MfaVerifyPage() {
  const { t } = useTranslation();
  const {
    mfaSession,
    isMfaRequired,
    isAuthenticated,
    verifyMfaLogin,
    error,
    clearError,
    isLoading,
  } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Create refs for the 6 code input fields
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Track the individual digits of the code
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(""));
  const [validationError, setValidationError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(0);

  // Focus the first input on page load
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Clear validation error when form fields change
  useEffect(() => {
    setValidationError(null);
  }, [codeDigits]);

  // Clear error when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Combine code digits into a single string
  const mfaCode = codeDigits.join("");

  // Redirect if already authenticated or MFA is not required
  if (isAuthenticated || (!isMfaRequired && !mfaSession)) {
    return <Navigate to="/" />;
  }

  // Handle input change and auto-focus to next field
  const handleInputChange = (index: number, value: string) => {
    // Check if the user pasted a full code (6+ digits)
    if (index === 0 && value.length >= 6) {
      // Extract the first 6 digits
      const pastedCode = value.replace(/[^0-9]/g, "").substring(0, 6);

      if (pastedCode.length === 6) {
        // Fill in all fields with the pasted code digits
        const newCodeDigits = pastedCode.split("");
        setCodeDigits(newCodeDigits);

        // Focus the last input field
        if (inputRefs[5].current) {
          inputRefs[5].current.focus();
        }

        // Auto-submit after a short delay
        setTimeout(() => {
          handleSubmitCode(pastedCode);
        }, 300);

        return;
      }
    }

    // Regular single-digit input handling
    // Only allow digits
    const digit = value.replace(/[^0-9]/g, "").substring(0, 1);

    // Update the digit at the specified index
    const newCodeDigits = [...codeDigits];
    newCodeDigits[index] = digit;
    setCodeDigits(newCodeDigits);

    // If a digit was entered and there's a next input, focus it
    if (digit && index < 5 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current?.focus();
    }

    // If all digits are filled, validate the code
    if (newCodeDigits.every((d) => d) && newCodeDigits.join("").length === 6) {
      handleSubmitCode(newCodeDigits.join(""));
    }
  };

  // Handle paste event specifically
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Clean the pasted data to only include digits
    const cleanPastedData = pastedData.replace(/[^0-9]/g, "");

    if (cleanPastedData.length >= 6) {
      // If pasting a complete code
      const newCodeDigits = cleanPastedData.substring(0, 6).split("");
      setCodeDigits(newCodeDigits);

      // Focus the last input field
      if (inputRefs[5].current) {
        inputRefs[5].current.focus();
      }

      // Auto-submit after a short delay
      setTimeout(() => {
        handleSubmitCode(newCodeDigits.join(""));
      }, 300);
    } else if (cleanPastedData.length > 0) {
      // If pasting a partial code, distribute the digits across fields
      const newCodeDigits = [...codeDigits];

      for (let i = 0; i < cleanPastedData.length; i++) {
        if (index + i < 6) {
          newCodeDigits[index + i] = cleanPastedData[i];
        }
      }

      setCodeDigits(newCodeDigits);

      // Focus the next empty field or the last filled field
      const nextEmptyIndex = newCodeDigits.findIndex((d) => !d);
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;

      if (inputRefs[focusIndex].current) {
        inputRefs[focusIndex].current?.focus();
      }
    }
  };

  // Handle key press for backspace to go to previous input
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && index > 0 && !codeDigits[index]) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmitCode = async (code: string) => {
    // Validate code has 6 digits
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setValidationError(t("auth.mfaCodeLength"));
      return;
    }

    try {
      await verifyMfaLogin(code);
    } catch (err) {
      // Error state is handled by the auth context
      console.error("MFA verification error:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitCode(mfaCode);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } py-12 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Logo Section */}
        <div className="flex justify-center items-center pt-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              className="h-12 w-auto"
              src="/device-manager-icon.svg"
              alt="Logo"
            />
            <h1
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Node Dash
            </h1>
          </Link>
        </div>

        {/* Title Section */}
        <div className="text-center">
          <h2
            className={`mt-6 text-3xl font-extrabold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("auth.verifyMfa")}
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("auth.enterMfaCode")}
          </p>
        </div>

        {/* Error message */}
        <AuthErrorMessage message={error || validationError} />

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex flex-col">
            <div className="flex justify-center gap-2 sm:gap-4 mb-6">
              {inputRefs.map((ref, index) => (
                <input
                  key={index}
                  ref={ref}
                  type="text"
                  inputMode="numeric"
                  maxLength={index === 0 ? 6 : 1}
                  value={codeDigits[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onPaste={(e) => handlePaste(e, index)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold border ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:border-blue-400"
                      : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                  } rounded-md focus:ring-2 ${
                    isDarkMode ? "focus:ring-blue-400" : "focus:ring-blue-500"
                  }`}
                  aria-label={`Digit ${index + 1}`}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                />
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || mfaCode.length !== 6}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : t("auth.continue")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
