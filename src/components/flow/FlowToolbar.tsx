import React from "react";
import { Panel } from "@xyflow/react";
import { useTranslation } from "react-i18next";
import { useFlow } from "@/hooks/api";
import { Button } from "../ui";

interface FlowToolbarProps {
  flowId?: string;
  isLocked: boolean;
  isSaving: boolean;
  hasUnsavedChanges?: boolean;
  onLockToggle: () => void;
  onAddNodeClick: () => void;
  onSave?: () => void;
  onShowDiff?: () => void; // Add callback for showing the diff modal
  isMobile?: boolean | undefined;
}

/**
 * FlowToolbar component for the flow editor
 * Contains the lock/unlock button and add node button
 */
const FlowToolbar: React.FC<FlowToolbarProps> = ({
  flowId,
  isLocked,
  isSaving,
  onLockToggle,
  onAddNodeClick,
}) => {
  const { t } = useTranslation();
  // Fetch flow data to display the name
  const { data: flow, isLoading } = useFlow(flowId || "");

  return (
    <>
      <Panel position="top-left" className="panel-title">
        <h1>
          {isLoading ? (
            <span className="text-gray-400">{t("common.loading")}</span>
          ) : flow ? (
            <>
              <span className="flex items-center text-lg font-semibold">
                {flow.name}
              </span>
              <span className="text-sm">{flow.description}</span>
            </>
          ) : (
            flowId
          )}
        </h1>
      </Panel>

      <Panel
        position={"top-right"}
        className={`panel-buttons flex-col flex-end justify-end`}
      >
        <Button
          onClick={onLockToggle}
          disabled={isSaving}
          title={isLocked ? t("flows.unlockFlow") : t("flows.lockFlow")}
          className={`
            ${isLocked ? "bg-red-500" : "bg-green-500"}
            p-2 rounded-md transition-colors duration-200 
            hover:bg-opacity-80 disabled:opacity-50 
             flex-shrink-0 ml-auto
          `}
          aria-label={isLocked ? t("flows.unlockFlow") : t("flows.lockFlow")}
          aria-pressed={isLocked}
          aria-disabled={isSaving}
          aria-busy={isSaving}
          aria-live="polite"
          aria-atomic="true"
        >
          {isLocked ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 20 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 20 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          )}
          <span>{isLocked ? t("flows.unlockFlow") : t("flows.lockFlow")}</span>
        </Button>

        {!isLocked && (
          <Button
            onClick={onAddNodeClick}
            className={`add-button p-2 rounded-md transition-colors duration-200 
            hover:bg-opacity-80 disabled:opacity-50 
             flex-shrink-0 ml-auto
          `}
          >
            + <span>{t("flows.addNode")}</span>
          </Button>
        )}
      </Panel>
    </>
  );
};

export default FlowToolbar;
