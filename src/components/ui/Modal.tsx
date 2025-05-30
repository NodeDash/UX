import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/ux/use-mobile";
import ActionButton from "./ActionButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = "md",
}) => {
  const theme = useTheme();
  const isDarkMode = theme.theme === "dark";
  const isMobile = useIsMobile();

  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Determine width class
  let widthClass = "";
  if (isMobile) {
    widthClass = "w-full h-full";
  } else {
    switch (width) {
      case "sm":
        widthClass = "w-[400px]";
        break;
      case "md":
        widthClass = "w-[600px]";
        break;
      case "lg":
        widthClass = "w-[800px]";
        break;
      case "xl":
        widthClass = "w-[80vw]";
        break;
      default:
        widthClass = "w-[600px]";
    }
  }

  // Define theme-specific styling
  const bgColor = isDarkMode ? "bg-[#18181b]" : "bg-[#fbf9fa]";
  const borderColor = isDarkMode ? "border-[#2c2c2c]" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";

  //based on isDarkMode, set the modal backdrop colour with some opacity
  const backdropColor = isDarkMode
    ? "bg-black/30 bg-opacity-75"
    : "bg-white/30 bg-opacity-75";

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className={
          "fixed inset-0 bg-opacity-50 backdrop-blur-[2px] z-50 " +
          backdropColor
        }
        onClick={onClose}
        style={{ backdropFilter: "blur(2px)" }}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div
          className={`${widthClass} ${
            isMobile ? "" : "max-h-[90vh]"
          } ${bgColor}  ${
            isMobile ? "" : "rounded-lg shadow-2xl"
          } pointer-events-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${borderColor}`}
          >
            <h2 className={`text-xl font-semibold ${textColor}`}>{title}</h2>
            <ActionButton onClick={onClose} variant="secondary" size="sm">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke={"white"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </ActionButton>
          </div>

          {/* Modal Content */}
          <div
            className="p-6 space-y-6 overflow-y-auto"
            style={{
              maxHeight: !isMobile
                ? "calc(90vh - 140px)"
                : "calc(100vh - 69px)",
            }}
          >
            {children}
          </div>

          {/* Modal Footer */}
          {footer && (
            <div
              className={`${
                !isMobile ? "px-6 py-4" : ""
              } border-t ${borderColor} flex justify-between`}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
