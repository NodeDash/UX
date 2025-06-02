import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AtSign, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { LoadingSpinner } from "@/components/ui";
import AuthErrorMessage from "@/components/ui/auth-error-message";
import AuthFormField from "@/components/ui/auth-form-field";

/**
 * Register Page component for user registration
 */
export default function RegisterPage() {
  const { t } = useTranslation();
  const { register, error, clearError, isLoading } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Clear validation error when form fields change
  useEffect(() => {
    setValidationError(null);
  }, [username, email, password, confirmPassword]);

  // Clear error when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validateForm = (): boolean => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setValidationError(t("auth.passwordsDoNotMatch"));
      return false;
    }

    // Check password length
    if (password.length < 8) {
      setValidationError(t("auth.passwordTooShort"));
      return false;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      setValidationError(t("auth.passwordRequiresUppercase"));
      return false;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      setValidationError(t("auth.passwordRequiresLowercase"));
      return false;
    }

    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      setValidationError(t("auth.passwordRequiresNumber"));
      return false;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setValidationError(t("auth.passwordRequiresSpecial"));
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError(t("auth.invalidEmail"));
      return false;
    }

    // Username validation (no spaces, special chars limited)
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(username)) {
      setValidationError(t("auth.invalidUsername"));
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
      await register(username, email, password);
      setRegistrationSuccess(true);
      // Success is handled by redirecting to email verification page
    } catch (err) {
      // Error state is handled by the auth context
      console.error("Registration error:", err);
      setRegistrationSuccess(false);
    }
  };

  // If registration was successful, redirect to email verify page with success indicator
  if (registrationSuccess) {
    return (
      <Navigate
        to={`/email-verify?email=${encodeURIComponent(email)}`}
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
            {t("auth.createAccount")}
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("auth.alreadyHaveAccount")}{" "}
            <Link
              to="/login"
              className={`font-medium text-blue-600 hover:text-blue-500 ${
                isDarkMode ? "text-blue-400 hover:text-blue-300" : ""
              }`}
            >
              {t("auth.signIn")}
            </Link>
          </p>
        </div>

        {/* Information about email verification */}
        <div
          className={`rounded-md ${
            isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
          } p-4`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle
                className="h-5 w-5 text-blue-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-blue-200" : "text-blue-800"
                }`}
              >
                {t("auth.emailVerificationRequired")}
              </p>
            </div>
          </div>
        </div>

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
              placeholder={t("auth.usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<User className="h-5 w-5" />}
            />

            <AuthFormField
              id="email"
              label={t("auth.email")}
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<AtSign className="h-5 w-5" />}
            />

            <AuthFormField
              id="password"
              label={t("auth.password")}
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" />}
            />

            {/* Password requirements indicator */}
            <div
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <p>{t("auth.passwordRequirements")}</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li className={password.length >= 8 ? "text-green-500" : ""}>
                  {t("auth.atLeastEightChars")}
                </li>
                <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
                  {t("auth.atLeastOneUppercase")}
                </li>
                <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>
                  {t("auth.atLeastOneLowercase")}
                </li>
                <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>
                  {t("auth.atLeastOneNumber")}
                </li>
                <li
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(password)
                      ? "text-green-500"
                      : ""
                  }
                >
                  {t("auth.atLeastOneSpecial")}
                </li>
              </ul>
            </div>

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
              {isLoading ? <LoadingSpinner size="sm" /> : t("auth.register")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
