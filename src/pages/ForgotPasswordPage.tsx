import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AtSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui";
import AuthErrorMessage from "@/components/ui/auth-error-message";
import AuthFormField from "@/components/ui/auth-form-field";
import { useTheme } from "@/context/ThemeContext";

/**
 * Forgot Password Page component for password reset request
 */
export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { forgotPassword, error, clearError, isLoading } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clear error when unmounting or when inputs change
  useEffect(() => {
    setValidationError(null);
    return () => clearError();
  }, [clearError, email]);

  const validateForm = (): boolean => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError(t("auth.invalidEmail"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await forgotPassword(email);
      // Redirect to reset password page after sending the reset link
      navigate("/reset-password", {
        state: { emailSent: true, userEmail: email },
      });
    } catch (err) {
      // Error state is handled by the auth context
      console.error("Forgot password error:", err);
    }
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
            {t("auth.forgotPassword")}
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("auth.enterEmailForReset")}
          </p>
        </div>

        {/* Error message */}
        <AuthErrorMessage message={error || validationError} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
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
                t("auth.sendResetLink")
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
