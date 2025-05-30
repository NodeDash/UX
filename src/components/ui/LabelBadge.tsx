import React from "react";
import { Label } from "@/types/label.types";

/**
 * Props interface for the LabelBadge component
 */
interface LabelBadgeProps {
  /** The label object to display */
  label: Label | { id: string | number; name: string; };
  /** Optional click handler for the badge */
  onClick?: () => void;
}

/**
 * A component that displays a label as a styled badge.
 * Used for showing labels associated with devices or other entities.
 *
 * @param {Object} props - Component props
 * @param {Label | { id: string | number; name: string }} props.label - The label object containing name and other properties
 * @param {Function} [props.onClick] - Optional click handler function
 * @returns {JSX.Element} A styled badge displaying the label name
 */
const LabelBadge: React.FC<LabelBadgeProps> = ({ label, onClick }) => {
  const baseClasses =
    "px-2 py-1 text-xs font-medium rounded-full cursor-pointer";

  return (
    <span
      className={`${baseClasses} bg-purple-900/50  border border-purple-700/30 hover:bg-purple-800/50 transition-colors text-nowrap`}
      onClick={onClick}
    >
      {label.name}
    </span>
  );
};

export default LabelBadge;
