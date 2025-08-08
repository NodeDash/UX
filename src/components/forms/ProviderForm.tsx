import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { ActionButton, Button, Checkbox } from "@/components/ui";
import {
  Provider,
  ProviderType,
  CreateProviderDto,
  UpdateProviderDto,
} from "@/types/provider.types";
import { OwnerType } from "@/types/common.types";
import { useTeamContext } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import CodeEditor from "../ui/CodeEditor";
interface ProviderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProviderDto | UpdateProviderDto) => void;
  isEdit: boolean;
  provider?: Provider;
}

// Define config field types
type ConfigFieldType = "string" | "number" | "boolean";

interface ConfigField {
  key: string;
  label: string;
  type: ConfigFieldType;
  defaultValue: string | number | boolean;
  required?: boolean; // Adding required flag
}

/**
 * Form component for creating and editing providers
 */
const ProviderForm: React.FC<ProviderFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isEdit,
  provider,
}) => {
  const { t } = useTranslation();

  // Basic form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProviderType>(ProviderType.chirpstack);

  const { selectedContext } = useTeamContext();
  const { user } = useAuth();

  const ownerType =
    selectedContext.type === "team" ? OwnerType.TEAM : OwnerType.USER;
  const ownerId =
    selectedContext.type === "team" ? selectedContext.team.id : user?.id || "";

  // Config form state
  const [configFormValues, setConfigFormValues] = useState<Record<string, any>>(
    {}
  );

  // JSON editor state for editing config
  const [configJson, setConfigJson] = useState<string>("");
  const [jsonError, setJsonError] = useState<string>("");

  // Track if form has been initialized with provider data
  const [isInitialized, setIsInitialized] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Get config fields based on provider type
  const getConfigFields = (providerType: ProviderType): ConfigField[] => {
    switch (providerType) {
      case ProviderType.chirpstack:
        return [
          {
            key: "CHIRPSTACK_API_SERVER",
            label: "API Server",
            type: "string",
            defaultValue: "",
            required: true,
          },
          {
            key: "CHIRPSTACK_API_TLS_ENABLED",
            label: "TLS Enabled",
            type: "boolean",
            defaultValue: true,
          },
          {
            key: "CHIRPSTACK_API_PORT",
            label: "API Port",
            type: "number",
            defaultValue: 443,
            required: true,
          },
          {
            key: "CHIRPSTACK_API_TOKEN",
            label: "API Token",
            type: "string",
            defaultValue: "",
            required: true,
          },
          {
            key: "CHIRPSTACK_API_TENANT_ID",
            label: "Tenant ID",
            type: "string",
            defaultValue: "",
            required: true,
          },
        ];
      case ProviderType.influxdb:
        return [
          {
            key: "url",
            label: "URL",
            type: "string",
            defaultValue: "",
            required: true,
          },
          {
            key: "org",
            label: "Organization",
            type: "string",
            defaultValue: "",
            required: true,
          },
          {
            key: "bucket",
            label: "Bucket",
            type: "string",
            defaultValue: "",
            required: true,
          },
          {
            key: "token",
            label: "Token",
            type: "string",
            defaultValue: "",
            required: true,
          },
          {
            key: "verify_ssl",
            label: "Verify SSL",
            type: "boolean",
            defaultValue: true,
          },
          {
            key: "precision",
            label: "Precision",
            type: "string",
            defaultValue: "ns",
          },
        ];
      case ProviderType.email:
        return [
          {
            key: "smtp_server",
            label: "SMTP Server",
            type: "string",
            defaultValue: "smtp.example.com",
            required: true,
          },
          {
            key: "smtp_port",
            label: "SMTP Port",
            type: "number",
            defaultValue: 587,
            required: true,
          },
          {
            key: "username",
            label: "Username",
            type: "string",
            defaultValue: "username",
            required: true,
          },
          {
            key: "password",
            label: "Password",
            type: "string",
            defaultValue: "password",
            required: true,
          },
          {
            key: "from_email",
            label: "From Email",
            type: "string",
            defaultValue: "noreply@example.com",
            required: true,
          },
          {
            key: "use_ssl",
            label: "Use SSL",
            type: "boolean",
            defaultValue: true,
          },
        ];
      case ProviderType.sms:
        return [
          {
            key: "api_key",
            label: "API Key",
            type: "string",
            defaultValue: "your-api-key",
            required: true,
          },
          {
            key: "service",
            label: "Service",
            type: "string",
            defaultValue: "twilio",
            required: true,
          },
          {
            key: "sender_id",
            label: "Sender ID",
            type: "string",
            defaultValue: "YOURBRAND",
            required: true,
          },
        ];
      default:
        return [
          {
            key: "custom_field",
            label: "Custom Field",
            type: "string",
            defaultValue: "",
            required: true,
          },
        ];
    }
  };

  const getDefaultConfigValues = useCallback(
    (providerType: ProviderType): Record<string, any> => {
      const fields = getConfigFields(providerType);
      return fields.reduce((acc, field) => {
        acc[field.key] = field.defaultValue;
        return acc;
      }, {} as Record<string, any>);
    },
    []
  );

  // Reset form when opening or changing provider
  useEffect(() => {
    if (isOpen) {
      if (isEdit && provider) {
        setName(provider.name);
        setDescription(provider.description || "");
        setType(provider.provider_type);

        // Keep the exact config from the database when editing
        const providerConfig = provider.config || {};
        setConfigFormValues(providerConfig);
        setConfigJson(JSON.stringify(providerConfig, null, 2));
        setIsInitialized(true);
      } else {
        setName("");
        setDescription("");
        setType(ProviderType.chirpstack);
        const defaultConfig = getDefaultConfigValues(ProviderType.chirpstack);
        setConfigFormValues(defaultConfig);
        setConfigJson(JSON.stringify(defaultConfig, null, 2));
        setIsInitialized(false);
      }
      setErrors({});
      setJsonError("");
      setSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEdit, provider]);

  // Update config form values when type changes (for new providers only)
  useEffect(() => {
    // Only apply defaults for new providers, not when editing
    if (!isEdit && !isInitialized) {
      const defaultConfig = getDefaultConfigValues(type);
      setConfigFormValues(defaultConfig);
      setConfigJson(JSON.stringify(defaultConfig, null, 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, isEdit]);

  /**
   * Strip http:// or https:// from a URL string
   */
  const stripUrlProtocol = (url: string): string => {
    return url.replace(/^(https?:\/\/)/, "");
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate basic fields
    if (!name.trim()) {
      newErrors.name = t("validation.required");
    }

    // For edit mode, validate JSON
    if (isEdit) {
      if (jsonError) {
        newErrors.json = jsonError;
      }
    } else {
      // Validate config fields for create mode
      const fields = getConfigFields(type);
      for (const field of fields) {
        // All fields are required except booleans which are always valid
        if (field.type !== "boolean" && field.required) {
          const value = configFormValues[field.key];

          if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
          ) {
            newErrors[field.key] = t("validation.required");
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      return;
    }

    let configData = configFormValues;

    // Parse JSON from editor in edit mode
    if (isEdit) {
      try {
        configData = JSON.parse(configJson);
      } catch {
        setJsonError(t("common.invalidJson"));
        return;
      }
    }

    // Prepare form data
    const formData: CreateProviderDto | UpdateProviderDto = {
      name,
      description,
      config: configData,
      provider_type: type,
      owner_type: ownerType,
      owner_id: ownerId,
    };

    onSubmit(formData);
    onClose();
  };

  // Handle field value change
  const handleFieldChange = (key: string, value: string | number | boolean) => {
    // Special handling for ChirpStack API server - strip protocol prefixes
    if (key === "CHIRPSTACK_API_SERVER" && typeof value === "string") {
      const cleanedValue = stripUrlProtocol(value);
      setConfigFormValues((prev) => ({
        ...prev,
        [key]: cleanedValue,
      }));
    } else {
      setConfigFormValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    }

    // Clear error when field is modified
    if (submitted && errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Handle provider type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ProviderType;
    setType(newType);

    // Only update config if it's a new provider
    if (!isEdit) {
      const defaultConfig = getDefaultConfigValues(newType);
      setConfigFormValues(defaultConfig);
      setConfigJson(JSON.stringify(defaultConfig, null, 2));
    }
  };

  // Handle JSON editor changes
  const handleJsonChange = (value: string) => {
    setConfigJson(value);
    setJsonError("");

    try {
      JSON.parse(value);
    } catch (error) {
      if (error instanceof Error) {
        setJsonError(error.message);
      } else {
        setJsonError(t("common.invalidJson"));
      }
    }
  };

  // Render form fields based on provider type
  const renderConfigFields = () => {
    // For edit mode, show JSON editor
    if (isEdit) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t("providers.editJsonConfig")}
          </p>
          <div className="border rounded-md">
            <CodeEditor
              value={configJson}
              onChange={handleJsonChange}
              language="json"
              height="300px"
            />
          </div>
          {jsonError && (
            <p className="text-red-500 text-xs mt-1">{jsonError}</p>
          )}
        </div>
      );
    }

    // For create mode, show fields
    const fields = getConfigFields(type);

    return (
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="block text-sm font-medium mb-1"
            >
              {field.label}{" "}
              {field.type !== "boolean" && field.required && (
                <span className="text-red-500">*</span>
              )}
            </label>
            {field.type === "boolean" ? (
              <div className="flex items-center">
                <Checkbox
                  id={field.key}
                  checked={!!configFormValues[field.key]}
                  onCheckedChange={(checked) =>
                    handleFieldChange(field.key, !!checked)
                  }
                />
                <label htmlFor={field.key} className="ml-2 text-sm">
                  {configFormValues[field.key] ? "Enabled" : "Disabled"}
                </label>
              </div>
            ) : field.type === "number" ? (
              <>
                <Input
                  id={field.key}
                  type="number"
                  value={configFormValues[field.key] || ""}
                  onChange={(e) =>
                    handleFieldChange(field.key, Number(e.target.value))
                  }
                  placeholder={String(field.defaultValue)}
                  className={errors[field.key] ? "border-red-500" : ""}
                />
                {errors[field.key] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.key]}
                  </p>
                )}
              </>
            ) : (
              <>
                <Input
                  id={field.key}
                  type="text"
                  value={configFormValues[field.key] || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={String(field.defaultValue)}
                  className={errors[field.key] ? "border-red-500" : ""}
                />
                {errors[field.key] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.key]}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Modal footer with action buttons
  const modalFooter = (
    <div className="flex justify-end gap-2 w-full">
      <ActionButton onClick={onClose} variant="secondary" size="sm">
        {t("common.cancel")}
      </ActionButton>
      <Button type="submit" form="provider-form" variant="default" size="sm">
        {isEdit ? t("common.update") : t("common.create")}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t("providers.edit") : t("providers.create")}
      footer={modalFooter}
      width="lg"
    >
      <form id="provider-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              {t("common.name")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (submitted && errors.name) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.name;
                    return newErrors;
                  });
                }
              }}
              placeholder={t("common.name")}
              className={errors.name ? "border-red-500" : ""}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              {t("common.description")}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("common.description")}
              className="w-full h-24 px-3 py-2 text-sm rounded-md border border-input bg-transparent"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              {t("providers.type")} <span className="text-red-500">*</span>
              {isEdit && (
                <span className="text-xs text-muted-foreground ml-2">
                  ({t("providers.typeCannotBeChanged")})
                </span>
              )}
            </label>
            <select
              id="type"
              value={type}
              onChange={handleTypeChange}
              disabled={isEdit}
              className="w-full px-3 py-2 rounded-md border border-input bg-transparent"
            >
              <option value={ProviderType.chirpstack}>
                {t("providers.types.chirpstack")}
              </option>
              <option value={ProviderType.influxdb}>
                {t("providers.types.influxdb")}
              </option>
              {/**
             commented out for future use
             <option value={ProviderType.EMAIL}>
                {t("providers.types.email")}
              </option>
              <option value={ProviderType.SMS}>
                {t("providers.types.sms")}
              </option>
              <option value={ProviderType.WEBHOOK}>
                {t("providers.types.webhook")}
              </option>
              <option value={ProviderType.GENERIC}>
                {t("providers.types.generic")}
              </option>
              */}
            </select>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium mb-3">
              {t("providers.config")}
            </h3>
            {renderConfigFields()}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProviderForm;
