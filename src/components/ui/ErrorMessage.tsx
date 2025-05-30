import React from "react";

interface ErrorMessageProps {
  message: string | null;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  if (!message) return null;

  return (
    <div
      className={`mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-lg  text-sm ${className}`}
    >
      {message}
    </div>
  );
};

export default ErrorMessage;
