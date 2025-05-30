import React from "react";
import { useTranslation } from "react-i18next";
import DeviceEditorModal from "./DeviceEditorModal";
import FunctionEditorModal from "./FunctionEditorModal";
import IntegrationEditorModal from "./IntegrationEditorModal";
import LabelEditorModal from "./LabelEditorModal";
import FlowEditorModal from "./FlowEditorModal";
import { Modal } from "../ui";
import ModalFooter from "./ModalFooter";
import { useQuickCreateModal } from "@/hooks/query/modals/useQuickCreateModal";
interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickCreateModal: React.FC<QuickCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  // Use our custom hook for state management
  const {
    activeEditor,
    handleEditorSelect,
    handleEditorClose,
    handleMainClose,
  } = useQuickCreateModal({ onClose });

  if (!isOpen) return null;

  // If an editor is active, render it instead of the selection modal
  if (activeEditor) {
    return (
      <>
        {activeEditor === "device" && (
          <DeviceEditorModal isOpen={true} onClose={handleEditorClose} />
        )}

        {activeEditor === "function" && (
          <FunctionEditorModal isOpen={true} onClose={handleEditorClose} />
        )}

        {activeEditor === "integration" && (
          <IntegrationEditorModal isOpen={true} onClose={handleEditorClose} />
        )}

        {activeEditor === "label" && (
          <LabelEditorModal isOpen={true} onClose={handleEditorClose} />
        )}

        {activeEditor === "flow" && (
          <FlowEditorModal isOpen={true} onClose={handleEditorClose} />
        )}
      </>
    );
  }

  // Render the selection modal using the standard Modal component
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleMainClose}
      title={t("nav.quickCreate")}
      footer={
        <ModalFooter
          onCancel={handleMainClose}
          cancelText={t("common.cancel")}
        />
      }
    >
      {/* Modal Content - Selection Grid */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {/* Device Button */}
          <div
            onClick={() => handleEditorSelect("device")}
            className="flex flex-col items-center justify-center p-6 bg-[#2c2c2c] rounded-lg 
                      border border-[#3c3c3c] cursor-pointer hover:bg-[#252525] 
                      hover:border-blue-500/50 transition-all"
          >
            <div className="text-3xl mb-3">📱</div>
            <div className="text-white font-medium">{t("common.device")}</div>
          </div>

          {/* Label Button */}
          <div
            onClick={() => handleEditorSelect("label")}
            className="flex flex-col items-center justify-center p-6 bg-[#2c2c2c] rounded-lg 
                      border border-[#3c3c3c] cursor-pointer hover:bg-[#252525] 
                      hover:border-blue-500/50 transition-all"
          >
            <div className="text-3xl mb-3">🏷️</div>
            <div className="text-white font-medium">{t("common.labels")}</div>
          </div>

          {/* Function Button */}
          <div
            onClick={() => handleEditorSelect("function")}
            className="flex flex-col items-center justify-center p-6 bg-[#2c2c2c] rounded-lg 
                      border border-[#3c3c3c] cursor-pointer hover:bg-[#252525] 
                      hover:border-blue-500/50 transition-all"
          >
            <div className="text-3xl mb-3">⚙️</div>
            <div className="text-white font-medium">
              {t("common.functions")}
            </div>
          </div>

          {/* Integration Button */}
          <div
            onClick={() => handleEditorSelect("integration")}
            className="flex flex-col items-center justify-center p-6 bg-[#2c2c2c] rounded-lg 
                      border border-[#3c3c3c] cursor-pointer hover:bg-[#252525] 
                      hover:border-blue-500/50 transition-all"
          >
            <div className="text-3xl mb-3">🔄</div>
            <div className="text-white font-medium">
              {t("common.integrations")}
            </div>
          </div>

          {/* Flow Button */}
          <div
            onClick={() => handleEditorSelect("flow")}
            className="flex flex-col items-center justify-center p-6 bg-[#2c2c2c] rounded-lg 
                      border border-[#3c3c3c] cursor-pointer hover:bg-[#252525] 
                      hover:border-blue-500/50 transition-all"
          >
            <div className="text-3xl mb-3">🌊</div>
            <div className="text-white font-medium">{t("common.flows")}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickCreateModal;
