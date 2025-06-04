import React, { ReactNode } from "react";
import { ActionButton, DocumentTitle } from "./index";

interface PageHeaderProps {
  // Remove the title prop if it's not being used
  title: string;
  icon?: ReactNode;
  onAddClick?: () => void;
  addButtonText?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  onAddClick,
  addButtonText = "+ Add",
}) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <DocumentTitle title={title} />
      <div className="flex items-center gap-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {onAddClick && (
        <ActionButton onClick={onAddClick} variant="primary">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {addButtonText}
        </ActionButton>
      )}
    </div>
  );
};

export default PageHeader;
