import React from "react";
import { Modal, FormField, TextAreaField } from "../ui";
import { Integration } from "@/types/integration.types";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useIntegrationEditorModal } from "@/hooks/query/modals/useIntegrationEditorModal";
import ModalFooter from "./ModalFooter";

interface IntegrationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration?: Integration;
}

const IntegrationEditorModal: React.FC<IntegrationEditorModalProps> = ({
  isOpen,
  onClose,
  integration,
}) => {
  const { t } = useTranslation();

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Use our custom TanStack Query hook
  const {
    name,
    setName,
    type,
    setType,
    url,
    setUrl,
    headers,
    ssl,
    setSsl,
    sslCertificate,
    setSslCertificate,
    topic,
    setTopic,
    username,
    setUsername,
    password,
    setPassword,
    isSubmitting,
    error,
    addHeader,
    removeHeader,
    updateHeader,
    handleSave,
    isEditMode,
  } = useIntegrationEditorModal({
    integration,
    onClose,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditMode
          ? t("integrations.editIntegration")
          : t("integrations.createIntegration")
      }
      footer={
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSave}
          isSubmitting={isSubmitting}
          submitText={
            isEditMode
              ? t("integrations.updateIntegration")
              : t("integrations.saveIntegration")
          }
        />
      }
      width="lg"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
        <FormField
          id="integration-name"
          label={t("integrations.integrationName")}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("integrations.enterName")}
          required
        />

        <div>
          <label
            className={`block text-sm font-medium ${
              isDarkMode ? "text-gray-200" : "text-black"
            } `}
          >
            {t("integrations.integrationType")}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="http"
                checked={type === "http"}
                onChange={() => setType("http")}
                className={`mr-2 ${
                  isDarkMode ? "text-gray-200" : "text-black"
                } `}
              />
              <span
                className={`${isDarkMode ? "text-gray-200" : "text-black"} `}
              >
                HTTP
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="mqtt"
                checked={type === "mqtt"}
                onChange={() => setType("mqtt")}
                className={`mr-2 ${
                  isDarkMode ? "text-gray-200" : "text-black"
                } `}
              />
              <span
                className={`${isDarkMode ? "text-gray-200" : "text-black"} `}
              >
                MQTT
              </span>
            </label>
          </div>
        </div>

        <FormField
          id="integration-url"
          label={t("integrations.url")}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={
            type === "http"
              ? "https://api.example.com/data"
              : "mqtt://broker.example.com:1883"
          }
          required
        />

        {type === "http" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-black"
                } `}
              >
                {t("integrations.headers")}
              </h3>
              <button
                onClick={addHeader}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded
                        hover:bg-blue-700 transition-colors"
              >
                + {t("integrations.addHeader")}
              </button>
            </div>

            {headers.map((header, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="flex-1">
                  <FormField
                    id={`header-key-${index}`}
                    label=""
                    type="text"
                    value={header.key}
                    onChange={(e) => updateHeader(index, "key", e.target.value)}
                    placeholder={t("integrations.headerName")}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    id={`header-value-${index}`}
                    label=""
                    type="text"
                    value={header.value}
                    onChange={(e) =>
                      updateHeader(index, "value", e.target.value)
                    }
                    placeholder={t("integrations.headerValue")}
                    className="w-full"
                  />
                </div>
                {headers.length > 1 && (
                  <button
                    onClick={() => removeHeader(index)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors self-center"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("integrations.sslTls")}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="true"
                    checked={ssl === "true"}
                    onChange={() => setSsl("true")}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 dark:text-white">
                    {t("integrations.enabled")}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="false"
                    checked={ssl === "false"}
                    onChange={() => setSsl("false")}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 dark:text-white">
                    {t("integrations.disabled")}
                  </span>
                </label>
              </div>
            </div>

            {ssl === "true" && (
              <div>
                <TextAreaField
                  id="ssl-certificate"
                  label={t("integrations.sslCertificate")}
                  value={sslCertificate}
                  onChange={(e) => setSslCertificate(e.target.value)}
                  placeholder={t("integrations.pasteSslCertificate")}
                  rows={6}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t("integrations.sslCertificateHelp")}
                </p>
              </div>
            )}

            <FormField
              id="mqtt-topic"
              label={t("integrations.topic")}
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t("integrations.mqttTopicPlaceholder")}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t("integrations.mqttTopicHelp")}
            </p>

            <FormField
              id="mqtt-username"
              label={t("integrations.username")}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("integrations.mqttUsername")}
            />

            <FormField
              id="mqtt-password"
              label={t("integrations.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("integrations.mqttPassword")}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default IntegrationEditorModal;
