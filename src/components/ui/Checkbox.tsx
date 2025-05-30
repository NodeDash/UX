import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
}

/**
 * Checkbox component for forms
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked,
      onCheckedChange,
      disabled,
      label,
      description,
      error,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            aria-describedby={`${id}-description`}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            disabled={disabled}
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
              {
                "opacity-50 cursor-not-allowed": disabled,
                "border-red-500": error,
              },
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label
                htmlFor={id}
                className={cn("font-medium text-gray-700", {
                  "opacity-50": disabled,
                  "text-red-500": error,
                })}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={`${id}-description`}
                className={cn("text-gray-500", {
                  "opacity-50": disabled,
                })}
              >
                {description}
              </p>
            )}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
