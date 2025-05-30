import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export interface SensitiveDataFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  isEditable?: boolean;
  isEditMode?: boolean;
  toggleEditable?: (editable: boolean) => void;
  originalValue?: string;
  allowedCharacters?: RegExp;
  helpText?: string;
}

const SensitiveDataField: React.FC<SensitiveDataFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  error,
  isEditable = true,
  isEditMode = false,
  toggleEditable,
  originalValue = "",
  allowedCharacters = /./g,
  helpText,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const inputBgColor = isDarkMode ? "bg-[#2c2c2c]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#3c3c3c]" : "border-gray-300";

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Filter input by allowed characters if specified
    if (allowedCharacters) {
      const filteredValue = e.target.value.replace(
        new RegExp(`[^${allowedCharacters.source}]`, "g"),
        ""
      );
      onChange(filteredValue);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-neutral-300 mb-2"
      >
        {label}{" "}
        {required && !isEditMode && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {isEditMode && !isEditable && toggleEditable ? (
          // Display masked value with edit/reveal buttons when in edit mode
          <>
            <div
              className={`w-full px-4 py-2 ${inputBgColor} ${borderColor} border rounded-lg
                  text-neutral-200 flex items-center justify-between`}
            >
              <span>
                {isVisible ? originalValue : "••••••••••••••••••••••••••••••••"}
              </span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="text-neutral-300 hover:text-white focus:outline-none"
                  title={isVisible ? `Hide ${label}` : `Show ${label}`}
                >
                  {isVisible ? (
                    // Eye icon with slash (hide)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    // Eye icon (show)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => toggleEditable(true)}
                  className="text-blue-400 hover:text-blue-300 focus:outline-none"
                  title={`Edit ${label}`}
                >
                  {/* Pencil edit icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          // Show editable input field
          <>
            <input
              id={id}
              type={isVisible ? "text" : "password"}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              required={required && !isEditMode}
              className={`w-full px-4 py-2 ${inputBgColor} ${borderColor} border rounded-lg
                  text-neutral-200 focus:outline-none focus:border-blue-500
                  focus:ring-1 focus:ring-blue-500 transition-colors
                  ${
                    error
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <button
                type="button"
                onClick={toggleVisibility}
                className="text-neutral-300 hover:text-white focus:outline-none"
                title={isVisible ? `Hide ${label}` : `Show ${label}`}
              >
                {isVisible ? (
                  // Eye icon with slash (hide)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  // Eye icon (show)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              {isEditMode && toggleEditable && (
                <button
                  type="button"
                  onClick={() => toggleEditable(false)}
                  className="text-red-400 hover:text-red-300 focus:outline-none"
                  title="Cancel editing"
                >
                  {/* X cancel icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}

      {helpText && <p className="mt-1 text-xs text-neutral-400">{helpText}</p>}

      {isEditMode && toggleEditable && (
        <p className="mt-1 text-xs text-neutral-400">
          {isEditable
            ? "Enter a new value or leave blank to keep the existing one."
            : `${label} is hidden for security. Click the edit button to change it.`}
        </p>
      )}
    </div>
  );
};

export default SensitiveDataField;
