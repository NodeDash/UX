import React from "react";
import Label from "./Label";

export interface FormFieldGridProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  labelClassName?: string;
  gridCols?: number; // Default to 4
  labelCols?: number; // Default to 1
}

const FormFieldGrid: React.FC<FormFieldGridProps> = ({
  label,
  children,
  required = false,
  error,
  labelClassName = "",
  gridCols = 4,
  labelCols = 1,
}) => {
  const contentCols = gridCols - labelCols;

  return (
    <div className={`grid grid-cols-${gridCols} items-center gap-4`}>
      <Label className={`col-span-${labelCols} ${labelClassName}`}>
        {label} {required && <span className="text-red-400">*</span>}
      </Label>

      <div className={`col-span-${contentCols}`}>
        {children}
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export default FormFieldGrid;
