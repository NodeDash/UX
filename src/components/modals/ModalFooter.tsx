import React from "react";
import { useTranslation } from "react-i18next";
import { Button, ActionButton } from "../ui";

export interface ModalFooterProps {
  onCancel: () => void;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  formId?: string; // For connecting to a form's submit action
  submitVariant?: "primary" | "secondary" | "danger";
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  onCancel,
  onSubmit,
  submitText,
  cancelText,
  isSubmitting = false,
  submitDisabled = false,
  formId,
  submitVariant = "primary",
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end space-x-2">
      <Button onClick={onCancel} variant="outline" disabled={isSubmitting}>
        {cancelText || t("common.cancel")}
      </Button>

      {formId ? (
        // Use form submission when formId is provided
        <Button
          type="submit"
          form={formId}
          disabled={isSubmitting || submitDisabled}
          className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
        >
          {isSubmitting
            ? t("common.submitting")
            : submitText || t("common.save")}
        </Button>
      ) : (
        // Use onClick when no formId is provided
        <ActionButton
          onClick={onSubmit ? onSubmit : () => {}}
          disabled={isSubmitting || submitDisabled}
          isLoading={isSubmitting}
          variant={submitVariant}
        >
          {submitText || t("common.save")}
        </ActionButton>
      )}
    </div>
  );
};

export default ModalFooter;
