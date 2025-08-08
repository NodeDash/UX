import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../ui";
import ModalFooter from "./ModalFooter";
import { useNodeSelectorModal } from "@/hooks/query/modals/useNodeSelectorModal";

interface NodeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNodeType: (
    type: "device" | "function" | "integration" | "label" | "storage"
  ) => void;
  enableStorage?: boolean;
}

const NodeSelectorModal: React.FC<NodeSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectNodeType,
  enableStorage = false,
}) => {
  const { t } = useTranslation();

  // Use our custom hook
  const { nodeTypes, isDarkMode, handleSelectNodeType } = useNodeSelectorModal({
    onSelectNodeType,
    enableStorage,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("common.selectNodeType")}
      footer={
        <ModalFooter onCancel={onClose} cancelText={t("common.cancel")} />
      }
    >
      <div className="grid grid-cols-2 gap-4 p-4">
        {nodeTypes.map((type) => (
          <button
            key={type.id}
            className={`
              flex flex-col items-center justify-center p-6 rounded-lg transition-colors shadow-sm hover:shadow
              ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600 hover:bg-gray-700 text-white"
                  : "bg-white border-gray-300 hover:bg-gray-50 text-gray-900"
              }
              border
            `}
            onClick={() => handleSelectNodeType(type.id)}
          >
            <div
              className={`
              w-12 h-12 flex items-center justify-center mb-3 rounded-full
              ${isDarkMode ? "bg-blue-900" : "bg-blue-50"}
            `}
            >
              {type.id === "device" && (
                <svg
                  className={`w-6 h-6 ${
                    isDarkMode ? "text-blue-300" : "text-blue-500"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              )}
              {type.id === "function" && (
                <svg
                  className={`w-6 h-6 ${
                    isDarkMode ? "text-blue-300" : "text-blue-500"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              )}
              {type.id === "integration" && (
                <svg
                  className={`w-6 h-6 ${
                    isDarkMode ? "text-blue-300" : "text-blue-500"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              )}
              {type.id === "label" && (
                <svg
                  className={`w-6 h-6 ${
                    isDarkMode ? "text-blue-300" : "text-blue-500"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              )}
              {type.id === "storage" && (
                <svg
                  className={`w-6 h-6 ${
                    isDarkMode ? "text-blue-300" : "text-blue-500"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 5c0-1.105 3.582-2 8-2s8 .895 8 2-3.582 2-8 2-8-.895-8-2zm16 0v14c0 1.105-3.582 2-8 2s-8-.895-8-2V5m16 6c0 1.105-3.582 2-8 2s-8-.895-8-2m16 4c0 1.105-3.582 2-8 2s-8-.895-8-2"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-md font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {type.name}
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default NodeSelectorModal;
