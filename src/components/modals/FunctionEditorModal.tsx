import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, FormField } from "../ui";
import { CustomFunction } from "@/types/function.types";
import CodeEditor from "../ui/CodeEditor";
import { useFunctionEditorModal } from "@/hooks/query/modals/useFunctionEditorModal";
import ModalFooter from "./ModalFooter";

interface FunctionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFunction?: CustomFunction; // This should be passed when editing existing function
  onRefresh?: () => void; // Optional callback to refresh function list after save
}

const FunctionEditorModal: React.FC<FunctionEditorModalProps> = ({
  isOpen,
  onClose,
  initialFunction,
  onRefresh,
}) => {
  const { t } = useTranslation();

  // Use our custom TanStack Query hook
  const { name, setName, code, setCode, handleSubmit, error, isSubmitting } =
    useFunctionEditorModal({
      initialFunction,
      onClose,
      onRefresh,
    });

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        initialFunction
          ? t("functions.editFunction")
          : t("functions.createFunction")
      }
      width="xl"
      footer={
        <ModalFooter
          onCancel={onClose}
          formId="function-form"
          isSubmitting={isSubmitting}
          submitText={isSubmitting ? t("common.saving") : t("common.save")}
        />
      }
    >
      <form id="function-form" onSubmit={onSubmitForm} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-md">{error}</div>
        )}
        <div className="space-y-4">
          <FormField
            id="name"
            label={t("functions.functionName")}
            placeholder={t("functions.enterFunctionName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("functions.code")}
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <CodeEditor
                value={code}
                onChange={setCode}
                language="javascript"
                height="300px"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default FunctionEditorModal;
