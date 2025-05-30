import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;
}

export default function FormField({
  id,
  label,
  error,
  description,
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  descriptionClassName,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className={cn(
          "block text-sm font-medium text-gray-700 dark:text-gray-300",
          labelClassName
        )}
      >
        {label}
      </label>

      <input
        id={id}
        className={cn(
          "w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md",
          "text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          { "border-red-500 focus:border-red-500 focus:ring-red-500": error },
          inputClassName
        )}
        {...props}
      />

      {error && (
        <p
          className={cn(
            "text-sm text-red-600 dark:text-red-400",
            errorClassName
          )}
        >
          {error}
        </p>
      )}

      {description && (
        <p
          className={cn(
            "text-sm text-gray-500 dark:text-gray-400",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
