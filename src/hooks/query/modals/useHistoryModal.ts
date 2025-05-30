import { useTranslation } from "react-i18next";

interface UseHistoryModalProps {
  entityId?: string;
  entityType?: "function" | "integration" | "flow" | "label" | "device";
  entityName?: string;
  // Legacy props
  functionId?: string;
  functionName?: string;
  integrationId?: string;
  integrationName?: string;
  flowId?: string;
  flowName?: string;
  labelId?: string;
  labelName?: string;
  deviceId?: string;
  deviceName?: string;
}

/**
 * Hook that provides data and handlers for the history modal, displaying
 * event history for various entity types.
 * 
 * @param props - The history modal properties
 * @returns Object with entity information and display data
 */
export function useHistoryModal({
  entityId,
  entityType,
  entityName,
  // Legacy props
  functionId,
  functionName,
  integrationId,
  integrationName,
  flowId,
  flowName,
  labelId,
  labelName,
  deviceId,
  deviceName,
}: UseHistoryModalProps) {
  const { t } = useTranslation();

  // Handle both new and legacy props
  const resolvedEntityId =
    entityId ||
    functionId ||
    integrationId ||
    flowId ||
    labelId ||
    deviceId ||
    "";
  const resolvedEntityType =
    entityType ||
    (functionId
      ? "function"
      : integrationId
      ? "integration"
      : flowId
      ? "flow"
      : labelId
      ? "label"
      : deviceId
      ? "device"
      : undefined);
  const resolvedEntityName =
    entityName ||
    functionName ||
    integrationName ||
    flowName ||
    labelName ||
    deviceName ||
    "";

  const title = t("history.titleTemplate", {
    entityType: t(`common.${resolvedEntityType}`),
    entityName: resolvedEntityName,
  });

  return {
    resolvedEntityId,
    resolvedEntityType,
    resolvedEntityName,
    title
  };
}