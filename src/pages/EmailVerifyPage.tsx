import React, { useState, useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, KeySquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import AuthFormField from "@/components/ui/auth-form-field";
import AuthErrorMessage from "@/components/ui/auth-error-message";
import { LoadingSpinner } from "@/components/ui";

/**
 * Email Verification Page component for verifying user email addresses
 */
export default function EmailVerifyPage() {
  const { t } = useTranslation();
  const {
    verifyEmail,
    resendVerificationEmail,
    isAuthenticated,
    emailVerified,
    error,
    clearError,
    isLoading,
  } = useAuth();

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [searchParams] = useSearchParams();

  // Get email from URL if available
  const emailFromUrl = searchParams.get("email") || "";

  // Form states
  const [email, setEmail] = useState(emailFromUrl);
  const [verificationCode, setVerificationCode] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Clear validation error when form fields change
  useEffect(() => {
    setValidationError(null);
  }, [email, verificationCode]);

  // Clear error when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Redirect if already authenticated and email verified
  if (isAuthenticated && emailVerified) {
    return <Navigate to="/" />;
  }

  const validateForm = (): boolean => {
    // Check if email is provided
    if (!email) {
      setValidationError(t("auth.emailRequired"));
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError(t("auth.invalidEmail"));
      return false;
    }

    // Check if verification code is provided
    if (!verificationCode.trim()) {
      setValidationError(t("auth.verificationCodeRequired"));
      return false;
    }

    return true;
  };

  const handleResend = async () => {
    if (!email) {
      setValidationError(t("auth.emailRequired"));
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError(t("auth.invalidEmail"));
      return;
    }

    try {
      await resendVerificationEmail(email);
      setResendSuccess(true);
      // Auto-hide success message after 5 seconds
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      console.error("Error resending verification email:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      return;
    }

    try {
      const success = await verifyEmail(email, verificationCode);
      if (success) {
        setVerificationSuccess(true);
      }
    } catch (err) {
      // Error state is handled by the auth context
      console.error("Email verification error:", err);
    }
  };

  // If verification succeeded, redirect to login page with success parameter
  if (verificationSuccess) {
    return (
      <Navigate
        to={`/login?email=${encodeURIComponent(email)}&email_verified=true`}
        replace
      />
    );
  }

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
              Device Manager
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
            {t("auth.verifyEmail")}
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("auth.enterVerificationCode")}
          </p>
        </div>

        {/* Resend success message */}
        {resendSuccess && (
          <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {t("auth.verificationEmailResent")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        <AuthErrorMessage message={error || validationError} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <AuthFormField
              id="email"
              label={t("auth.email")}
              type="email"
              required
              placeholder={t("auth.enterEmail")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-5 w-5" />}
            />

            <AuthFormField
              id="verification-code"
              label={t("auth.verificationCode")}
              type="text"
              required
              placeholder={t("auth.enterVerificationCode")}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              icon={<KeySquare className="h-5 w-5" />}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : t("auth.verifyEmail")}
            </button>
          </div>

          <div className="text-center mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className={`text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline ${
                isDarkMode ? "text-blue-400 hover:text-blue-300" : ""
              }`}
            >
              {t("auth.resendVerificationCode")}
            </button>

            <Link
              to="/login"
              className={`font-medium ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-500"
              } text-sm`}
            >
              {t("auth.backToLogin")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
