import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/ux/useToast";
import { PageContainer, PageHeader } from "@/components/ui";
import { useEffect, useState } from "react";
import MfaSetup from "@/components/ui/MfaSetup";
import MfaDisable from "@/components/ui/MfaDisable";
import { IconSettings } from "@tabler/icons-react";

const SettingsPage = () => {
  const { t } = useTranslation();
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, getMfaStatus, isLoading } = useAuth();
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-[#18181b]" : "bg-[#fbf9fa]";
  const shadowColor = isDarkMode ? "shadow-[#18181b]" : "shadow-gray-400";
  const toast = useToast();

  const [isMfaEnabled, setIsMfaEnabled] = useState<boolean | null>(null);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [showMfaDisable, setShowMfaDisable] = useState(false);

  useEffect(() => {
    // Initialize MFA status from user object if available
    if (user?.mfa_enabled !== undefined) {
      setIsMfaEnabled(user.mfa_enabled);
    }
    // Otherwise fetch the status from the server
    else {
      const checkMfaStatus = async () => {
        try {
          const status = await getMfaStatus();
          setIsMfaEnabled(status);
        } catch (error) {
          console.error("Failed to fetch MFA status:", error);
          // Set to false as fallback to prevent continuous loading
          setIsMfaEnabled(false);
        }
      };
      checkMfaStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value as "en" | "es");
    toast.success(t("settings.languageChanged", { lng: e.target.value }));
  };

  const handleMfaSetupComplete = () => {
    setShowMfaSetup(false);
    setIsMfaEnabled(true);
    toast.success(t("settings.mfaEnabled"));
  };

  const handleMfaDisableComplete = () => {
    setShowMfaDisable(false);
    setIsMfaEnabled(false);
    toast.success(t("settings.mfaDisabled"));
  };

  return (
    <PageContainer>
      <PageHeader
        title={t("settings.title")}
        icon={<IconSettings className="text-blue-600" size={24} />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:min-w-6xl">
        {/* Language Settings Card */}
        <div
          className={` ${bgColor} ${shadowColor}
             p-6 rounded-lg shadow-2xl transition-all hover:shadow-lg`}
        >
          <h2
            className={`settings-title text-xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("settings.language")}
          </h2>
          <p
            className={`mb-4 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {t("settings.languageDescription")}
          </p>
          <div className="form-group">
            <select
              id="language"
              name="language"
              value={language}
              onChange={handleLanguageChange}
              className={`form-input w-full p-2 rounded border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-blue-500 focus:border-blue-500`}
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Theme Settings Card */}
        <div
          className={` ${bgColor} ${shadowColor}
            p-6 rounded-lg shadow-2xl transition-all hover:shadow-lg`}
        >
          <h2
            className={`settings-title text-xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("settings.theme")}
          </h2>
          <p
            className={`mb-4 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {t("settings.themeDescription")}
          </p>
          <div className="flex items-center justify-between mt-6">
            <label
              className={`text-base font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {isDarkMode ? t("settings.darkMode") : t("settings.lightMode")}
            </label>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-14 w-24 flex-shrink-0 cursor-pointer rounded-full border-2 p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isDarkMode
                  ? "border-blue-600 bg-blue-600"
                  : "border-gray-200 bg-gray-200"
              }`}
              aria-label="Toggle theme"
            >
              <span className="sr-only">
                {isDarkMode
                  ? t("settings.switchToLight")
                  : t("settings.switchToDark")}
              </span>
              <span
                className={`flex h-full w-1/2 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                  isDarkMode ? "translate-x-full" : "translate-x-0"
                }`}
              >
                {isDarkMode ? (
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-8 w-8 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* MFA Security Settings Card */}
        <div
          className={` ${bgColor} ${shadowColor}
            p-6 rounded-lg shadow-2xl transition-all hover:shadow-lg`}
        >
          <h2
            className={`settings-title text-xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("settings.securitySettings")}
          </h2>

          <div className="mb-6">
            <h3
              className={`text-lg font-medium mb-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {t("settings.twoFactorAuth")}
            </h3>
            <p
              className={`mb-4 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {t("settings.twoFactorAuthDescription")}
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : isMfaEnabled === null ? (
              <div className="py-4 text-center text-gray-500">
                {t("common.loading")}
              </div>
            ) : showMfaSetup ? (
              <MfaSetup onComplete={handleMfaSetupComplete} />
            ) : showMfaDisable ? (
              <MfaDisable onComplete={handleMfaDisableComplete} />
            ) : (
              <div className="flex items-center justify-between mt-4">
                <div>
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {t("settings.twoFactorAuthStatus")}:
                  </span>
                  {isMfaEnabled ? (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {t("settings.enabled")}
                    </span>
                  ) : (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {t("settings.disabled")}
                    </span>
                  )}
                </div>

                {isMfaEnabled ? (
                  <button
                    onClick={() => setShowMfaDisable(true)}
                    className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                  >
                    {t("settings.disable")}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowMfaSetup(true)}
                    className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    {t("settings.enable")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional settings cards can be added here */}
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
