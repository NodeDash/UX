import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
  status: string;
  type?:
    | "default"
    | "integration"
    | "device"
    | "label"
    | "flow"
    | "function"
    | "provider"
    | "deviceHistory"
    | "provider_type";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "default",
}) => {
  const baseClasses =
    "px-2 py-1 text-xs font-medium rounded-full text-nowrap text-white";

  const theme = useTheme();
  const isDarkMode = theme.theme === "dark";

  const { t } = useTranslation();

  // Updated: Removed /50 opacity for dark mode backgrounds
  const bgGreen = isDarkMode ? "bg-green-900/50" : "bg-green-900/80";
  const bgRed = isDarkMode ? "bg-red-900/50" : "bg-red-900/80";
  const bgYellow = isDarkMode ? "bg-yellow-900/50" : "bg-yellow-900/80";
  const bgBlue = isDarkMode ? "bg-blue-900/50" : "bg-blue-900/80";

  // Border and neutral colors remain potentially different for dark/light
  const bgNeutral = isDarkMode ? "bg-neutral-800/30" : "bg-gray-200";
  const textNeutral = isDarkMode ? "text-white" : "text-gray-800"; // Added for default case text
  const borderNeutral = isDarkMode
    ? "border-neutral-700/30"
    : "border-gray-300";
  const borderGreen = isDarkMode ? "border-green-700/30" : "border-green-700";
  const borderRed = isDarkMode ? "border-red-700/30" : "border-red-700";
  const borderYellow = isDarkMode
    ? "border-yellow-700/30"
    : "border-yellow-700";
  const borderBlue = isDarkMode ? "border-blue-700/30" : "border-blue-700";

  // Refactored to use color variables
  if (type === "integration") {
    switch (status) {
      case "success":
        return (
          <span className={`${baseClasses} ${bgGreen} border ${borderGreen}`}>
            {t("common.success")}
          </span>
        );
      case "error":
        return (
          <span className={`${baseClasses} ${bgRed} border ${borderRed}`}>
            {t("common.error")}
          </span>
        );
      case "disconnected":
        return (
          <span className={`${baseClasses} ${bgYellow} border ${borderYellow}`}>
            {t("common.disconnected")}
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} ${bgNeutral} border ${borderNeutral} ${textNeutral}`}
          >
            {status}
          </span>
        );
    }
  }

  if (type === "device") {
    switch (status) {
      case "online":
        return (
          <span className={`${baseClasses} ${bgGreen} border ${borderGreen}`}>
            {t("common.online")}
          </span>
        );
      case "offline":
        return (
          <span className={`${baseClasses} ${bgRed} border ${borderRed}`}>
            {t("common.offline")}
          </span>
        );
      case "never_seen":
        return (
          <span className={`${baseClasses} ${bgBlue} border ${borderBlue}`}>
            {t("common.neverSeen")}
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} ${bgNeutral} border ${borderNeutral} ${textNeutral}`}
          >
            {status}
          </span>
        );
    }
  }

  if (type === "deviceHistory") {
    switch (status) {
      case "uplink":
        return (
          <span className={`${baseClasses} ${bgGreen} border ${borderGreen}`}>
            {t("common.uplink")}
          </span>
        );
      case "join":
        return (
          <span className={`${baseClasses} ${bgBlue} border ${borderBlue}`}>
            {t("common.join")}
          </span>
        );
      case "online":
        return (
          <span className={`${baseClasses} ${bgGreen} border ${borderGreen}`}>
            {t("common.online")}
          </span>
        );
      case "offline":
        return (
          <span className={`${baseClasses} ${bgRed} border ${borderRed}`}>
            {t("common.offline")}
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} ${bgNeutral} border ${borderNeutral} ${textNeutral}`}
          >
            {status}
          </span>
        );
    }
  }

  if (type === "label") {
    switch (status) {
      case "success":
        return (
          <span className={`${baseClasses} ${bgGreen} border ${borderGreen}`}>
            {t("common.success")}
          </span>
        );
      case "error":
        return (
          <span className={`${baseClasses} ${bgRed} border ${borderRed}`}>
            {t("common.error")}
          </span>
        );
      case "warning":
        return (
          <span className={`${baseClasses} ${bgYellow} border ${borderYellow}`}>
            {t("common.warning")}
          </span>
        );
      case "info":
        return (
          <span className={`${baseClasses} ${bgBlue} border ${borderBlue}`}>
            {t("common.info")}
          </span>
        );
      // Added default case for label type
      default:
        return (
          <span
            className={`${baseClasses} ${bgNeutral} border ${borderNeutral} ${textNeutral}`}
          >
            {status}
          </span>
        );
    }
  }

  if (type === "flow") {
    switch (status) {
      case "success":
        return (
          <span className={`${baseClasses} ${bgGreen} border ${borderGreen}`}>
            {t("common.success")}
          </span>
        );
      case "error":
        return (
          <span className={`${baseClasses} ${bgRed} border ${borderRed}`}>
            {t("common.error")}
          </span>
        );
      case "partial_success":
        return (
          <span className={`${baseClasses} ${bgYellow} border ${borderYellow}`}>
            {t("common.partialSuccess")}
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} ${bgBlue} border ${borderBlue}`}>
            {t("common.pending")}
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} ${bgNeutral} border ${borderNeutral} ${textNeutral}`}
          >
            No Status
          </span>
        );
    }
  }

  if (type === "function") {
    switch (status) {
      case "success":
        return (
          <span className={`${baseClasses} ${bgGreen} border ${borderGreen}`}>
            {t("common.success")}
          </span>
        );
      case "error":
        return (
          <span className={`${baseClasses} ${bgRed} border ${borderRed}`}>
            {t("common.error")}
          </span>
        );
      case "partial_success":
        return (
          <span className={`${baseClasses} ${bgYellow} border ${borderYellow}`}>
            {t("common.partialSuccess")}
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} ${bgBlue} border ${borderBlue}`}>
            {t("common.pending")}
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} ${bgNeutral} border ${borderNeutral} ${textNeutral}`}
          >
            {status ?? t("common.noStatus")}
          </span>
        );
    }
  }

  if (type === "provider") {
    //active/inactive
    switch (status) {
      case "active":
        return (
          <span className={`${baseClasses} ${bgGreen} border ${borderGreen}`}>
            {t("common.active")}
          </span>
        );
      case "inactive":
        return (
          <span className={`${baseClasses} ${bgRed} border ${borderRed}`}>
            {t("common.inactive")}
          </span>
        );
      case "error":
        return (
          <span className={`${baseClasses} ${bgRed} border ${borderRed}`}>
            {t("common.error")}
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} ${bgNeutral} border ${borderNeutral} ${textNeutral}`}
          >
            {status ?? t("common.noStatus")}
          </span>
        );
    }
  }

  if (type === "provider_type") {
    switch (status) {
      case "chirpstack":
        return (
          <span className={`${baseClasses} ${bgGreen} border ${borderGreen}`}>
            {t("providers.types.chirpstack")}
          </span>
        );
      case "email":
        return (
          <span className={`${baseClasses} ${bgBlue} border ${borderBlue}`}>
            {t("providers.types.email")}
          </span>
        );
      case "sms":
        return (
          <span className={`${baseClasses} ${bgYellow} border ${borderYellow}`}>
            {t("providers.types.sms")}
          </span>
        );
      case "influxdb":
        return (
          <span className={`${baseClasses} ${bgBlue} border ${borderBlue}`}>
            {t("providers.types.influxdb")}
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} ${bgNeutral} border ${borderNeutral} ${textNeutral}`}
          >
            {status ?? t("common.noStatus")}
          </span>
        );
    }
  }

  // Default status display - updated to use variables and handle text color
  return (
    <span
      className={`${baseClasses} ${bgNeutral} border ${borderNeutral} ${textNeutral}`}
    >
      {status ?? t("common.noStatus")}
    </span>
  );
};

export default StatusBadge;
