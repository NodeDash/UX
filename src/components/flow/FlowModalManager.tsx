import React from "react";
import NodeSelectorModal from "../modals/NodeSelectorModal";
import EntitySelectorModal from "../modals/EntitySelectorModal";
import { useProviders } from "@/hooks/api";
import { ProviderType } from "@/types/provider.types";

interface FlowModalManagerProps {
  functions: any[];
  integrations: any[];
  devices: any[];
  labels: any[];
  getExistingEntityIds: (
    nodeType:
      | "device"
      | "function"
      | "integration"
      | "position-logger"
      | "storage"
      | "action"
      | "label"
  ) => string[];
  createNode: (
    nodeType:
      | "function"
      | "device"
      | "integration"
      | "position-logger"
      | "storage"
      | "action"
      | "label",
    entityId?: string,
    entityName?: string
  ) => void;
  modalState: {
    isNodeSelectorOpen: boolean;
    setIsNodeSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
    functionSelectorOpen: boolean;
    setFunctionSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
    integrationSelectorOpen: boolean;
    setIntegrationSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
    deviceSelectorOpen: boolean;
    setDeviceSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
    labelSelectorOpen: boolean;
    setLabelSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
    storageSelectorOpen: boolean;
    setStorageSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleNodeTypeSelect: (
      nodeType: "device" | "function" | "integration" | "label" | "storage"
    ) => void;
  };
}

/**
 * Component to manage all modals used in the flow editor
 * Centralizes modal state and interactions in one place
 */
const FlowModalManager: React.FC<FlowModalManagerProps> = ({
  functions,
  integrations,
  devices,
  labels,
  getExistingEntityIds,
  createNode,
  modalState,
}) => {
  const {
    isNodeSelectorOpen,
    setIsNodeSelectorOpen,
    functionSelectorOpen,
    setFunctionSelectorOpen,
    integrationSelectorOpen,
    setIntegrationSelectorOpen,
    deviceSelectorOpen,
    setDeviceSelectorOpen,
    labelSelectorOpen,
    setLabelSelectorOpen,
    storageSelectorOpen,
    setStorageSelectorOpen,
    handleNodeTypeSelect,
  } = modalState;

  // Load providers and filter for InfluxDB
  const { data: providers = [] } = useProviders();
  const influxProviders = providers.filter(
    (p) => p.provider_type === ProviderType.influxdb
  );

  // Entity selection handlers
  const handleFunctionSelect = (func: any) => {
    setFunctionSelectorOpen(false);
    createNode("function", func.id, func.name);
  };

  const handleIntegrationSelect = (integration: any) => {
    setIntegrationSelectorOpen(false);
    createNode("integration", integration.id, integration.name);
  };

  const handleDeviceSelect = (device: any) => {
    setDeviceSelectorOpen(false);
    createNode("device", device.id, device.name);
  };

  const handleLabelSelect = (label: any) => {
    setLabelSelectorOpen(false);
    createNode("label", label.id, label.name);
  };

  const handleStorageSelect = (provider: any) => {
    setStorageSelectorOpen(false);
    // Create a storage node associated with the selected provider
    createNode("storage", provider.id, provider.name);
  };

  return (
    <>
      <NodeSelectorModal
        isOpen={isNodeSelectorOpen}
        onClose={() => setIsNodeSelectorOpen(false)}
        onSelectNodeType={handleNodeTypeSelect}
        enableStorage={influxProviders.length > 0}
      />

      <EntitySelectorModal
        isOpen={functionSelectorOpen}
        onClose={() => setFunctionSelectorOpen(false)}
        entities={functions}
        title="functions.title"
        onSelect={handleFunctionSelect}
        existingEntityIds={getExistingEntityIds("function")}
      />

      <EntitySelectorModal
        isOpen={integrationSelectorOpen}
        onClose={() => setIntegrationSelectorOpen(false)}
        entities={integrations}
        title="integrations.title"
        onSelect={handleIntegrationSelect}
        existingEntityIds={getExistingEntityIds("integration")}
      />

      <EntitySelectorModal
        isOpen={deviceSelectorOpen}
        onClose={() => setDeviceSelectorOpen(false)}
        entities={devices}
        title="devices.title"
        onSelect={handleDeviceSelect}
        existingEntityIds={getExistingEntityIds("device")}
      />

      <EntitySelectorModal
        isOpen={labelSelectorOpen}
        onClose={() => setLabelSelectorOpen(false)}
        entities={labels}
        title="labels.title"
        onSelect={handleLabelSelect}
        existingEntityIds={getExistingEntityIds("label")}
      />

      {/* Storage selector only if we have at least one influx provider */}
      <EntitySelectorModal
        isOpen={storageSelectorOpen}
        onClose={() => setStorageSelectorOpen(false)}
        entities={influxProviders}
        title="storage.title"
        onSelect={handleStorageSelect}
        existingEntityIds={getExistingEntityIds("storage")}
      />
    </>
  );
};

export default FlowModalManager;
