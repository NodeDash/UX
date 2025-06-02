import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Lock, AlertCircle, CheckCircle, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { LoadingSpinner } from "@/components/ui";
import AuthErrorMessage from "@/components/ui/auth-error-message";
import AuthFormField from "@/components/ui/auth-form-field";

/**
 * Login Page component for user authentication
 */
export default function LoginPage() {
  const { t } = useTranslation();
  const { login, error, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Check for email verification success from query parameters
  const emailVerified = searchParams.get("email_verified") === "true";

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Check for redirect parameter
  const redirect = searchParams.get("redirect") || "/";

  // Check for status messages from other operations
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setStatusMessage({
        type: "success",
        message: t("auth.emailVerificationRequired"),
      });
    } else if (searchParams.get("passwordResetSent") === "true") {
      setStatusMessage({
        type: "success",
        message: t("auth.passwordResetSent"),
      });
    } else if (searchParams.get("passwordReset") === "true") {
      setStatusMessage({
        type: "success",
        message: t("auth.passwordResetSuccessful"),
      });
    } else if (emailVerified) {
      setStatusMessage({
        type: "success",
        message: t("auth.emailVerifiedSuccessfully"),
      });
    }
  }, [searchParams, t, emailVerified]);

  // Clear validation error when form fields change
  useEffect(() => {
    setValidationError(null);
  }, [username, password]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const validateForm = (): boolean => {
    // Simple validation - ensure fields are not empty
    if (!username.trim()) {
      setValidationError(t("auth.usernameRequired"));
      return false;
    }

    if (!password.trim()) {
      setValidationError(t("auth.passwordRequired"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await login(username, password, rememberMe);
  };

  // Message component for email verification instructions
  const renderEmailVerificationInstructions = () => {
    if (searchParams.get("registered") === "true") {
      return (
        <div
          className={`mt-2 text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <p className="mb-2">{t("auth.checkYourEmailInstructions")}</p>
          <Link
            to="/email-verify"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            {t("auth.goToEmailVerification")} →
          </Link>
        </div>
      );
    }
    return null;
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
              NodeDash
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
            {t("auth.signIn")}
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("auth.orCreateAccount")}{" "}
            <Link
              to="/register"
              className={`font-medium text-blue-600 hover:text-blue-500 ${
                isDarkMode ? "text-blue-400 hover:text-blue-300" : ""
              }`}
            >
              {t("auth.register")}
            </Link>
          </p>
        </div>

        {/* Status messages */}
        {statusMessage && (
          <div
            className={`rounded-md p-4 ${
              statusMessage.type === "success"
                ? isDarkMode
                  ? "bg-green-900/20"
                  : "bg-green-50"
                : isDarkMode
                ? "bg-red-900/20"
                : "bg-red-50"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {statusMessage.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    statusMessage.type === "success"
                      ? isDarkMode
                        ? "text-green-200"
                        : "text-green-800"
                      : isDarkMode
                      ? "text-red-200"
                      : "text-red-800"
                  }`}
                >
                  {statusMessage.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Email verification instructions */}
        {renderEmailVerificationInstructions()}

        {/* Error message */}
        <AuthErrorMessage message={error || validationError} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <AuthFormField
              id="username"
              label={t("auth.username")}
              type="text"
              required
              autoComplete="username"
              placeholder={t("auth.enterUsername")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<User className="h-5 w-5" />}
            />

            <AuthFormField
              id="password"
              label={t("auth.password")}
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" />}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className={`ml-2 block text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                {t("auth.rememberMe")}
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className={`font-medium text-blue-600 hover:text-blue-500 ${
                  isDarkMode ? "text-blue-400 hover:text-blue-300" : ""
                }`}
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : t("auth.signIn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
