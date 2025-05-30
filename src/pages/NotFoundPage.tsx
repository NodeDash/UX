import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center">
      <div
        className={`max-w-md w-full ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        <div className="mb-8">
          <span className="text-[220px] opacity-20 font-extrabold">404</span>

          <p className="text-2xl font-bold mb-4 mt-8">
            {t("notFound.title", "Page Not Found")}
          </p>

          <p className="mb-8 text-lg opacity-70">
            {t(
              "notFound.message",
              "The page you're looking for doesn't exist or has been moved."
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg hover:shadow-xl"
            >
              {t("notFound.backHome", "Back to Home")}
            </Link>

            <button
              onClick={() => window.history.back()}
              className={`px-6 py-3 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } font-medium transition-all`}
            >
              {t("notFound.goBack", "Go Back")}
            </button>
          </div>
        </div>

        <div className="mt-12 mx-auto text-center">
          <img
            src="/device-manager-icon.svg"
            alt="Device Manager"
            width="200px"
            className="mx-auto text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
