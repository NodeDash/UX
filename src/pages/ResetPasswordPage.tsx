import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Lock, Hash, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import AuthFormField from "@/components/ui/auth-form-field";
import AuthErrorMessage from "@/components/ui/auth-error-message";
import { DocumentTitle, LoadingSpinner } from "@/components/ui";

/**
 * Reset Password Page component for setting a new password
 */
export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const { resetPassword, error, clearError, isLoading } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const location = useLocation();

  // Get email and code from URL query parameters
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const codeFromUrl = searchParams.get("code") || "";

  // Check if email was sent (coming from forgot password page)
  const emailSent = location.state?.emailSent || false;
  const userEmail = location.state?.userEmail || emailFromUrl;

  // Form states
  const [email, setEmail] = useState(userEmail);
  const [code, setCode] = useState(codeFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Clear validation error when form fields change
  useEffect(() => {
    setValidationError(null);
  }, [email, code, password, confirmPassword]);

  // Clear error when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

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

    // Check if code is provided
    if (!code) {
      setValidationError(t("auth.authCodeRequired"));
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setValidationError(t("auth.passwordsDoNotMatch"));
      return false;
    }

    // Check password strength
    if (password.length < 8) {
      setValidationError(t("auth.passwordTooShort"));
      return false;
    }

    // Additional password validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      setValidationError(t("auth.passwordRequirementsNotMet"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword(email, code, password);
      setResetSuccess(true);
    } catch (err) {
      // Error state is handled by the auth context
      console.error("Reset password error:", err);
    }
  };

  // If password reset was successful, show success message
  if (resetSuccess) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        } py-12 px-4 sm:px-6 lg:px-8`}
      >
        <DocumentTitle title={t("auth.passwordReset")} />
        <div
          className={`max-w-md w-full space-y-8
          ${isDarkMode ? "bg-gray-800" : "bg-white"} 
         p-8 rounded-lg shadow-md`}
        >
          <div className="flex justify-center text-green-500">
            <CheckCircle size={64} strokeWidth={1} />
          </div>
          <div className="text-center">
            <h2
              className={`text-3xl font-extrabold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("auth.passwordResetSuccessful")}
            </h2>
            <p
              className={`mt-4 text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("auth.passwordResetSuccessMessage")}
            </p>
            <div className="mt-6">
              <Link
                to="/login?passwordReset=true"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {t("auth.proceedToLogin")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If email was just sent, show instructions
  if (emailSent && !resetSuccess) {
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
                NodeDash
              </h1>
            </Link>
          </div>
          <div className="text-center">
            <h2
              className={`mt-6 text-3xl font-extrabold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("auth.checkYourEmail")}
            </h2>
            <p
              className={`mt-4 text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("auth.passwordResetEmailSent")} <strong>{email}</strong>
            </p>
            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("auth.followEmailInstructions")}
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className={`font-medium text-blue-600 hover:text-blue-500 ${
                isDarkMode ? "text-blue-400 hover:text-blue-300" : ""
              } text-sm`}
            >
              {t("auth.backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Standard password reset form
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
              NodeDash
            </h1>
          </Link>
        </div>
        <div className="text-center">
          <h2
            className={`mt-6 text-3xl font-extrabold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("auth.resetPassword")}
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("auth.enterResetInfo")}
          </p>
        </div>

        {/* Error messages */}
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
              id="auth-code"
              label={t("auth.authCode")}
              type="text"
              required
              placeholder={t("auth.enterAuthCode")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              icon={<Hash className="h-5 w-5" />}
            />

            <AuthFormField
              id="password"
              label={t("auth.newPassword")}
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" />}
            />

            <AuthFormField
              id="confirm-password"
              label={t("auth.confirmPassword")}
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" />}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                t("auth.resetPassword")
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className={`font-medium text-blue-600 hover:text-blue-500 ${
                isDarkMode ? "text-blue-400 hover:text-blue-300" : ""
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
