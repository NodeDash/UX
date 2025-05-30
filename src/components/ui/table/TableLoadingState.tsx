import React from "react";
import LoadingSpinner from "../LoadingSpinner";

export const TableLoadingState: React.FC = () => {
  return <LoadingSpinner message="Loading..." fullPage={false} />;
};
