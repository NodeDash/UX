import React, { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "page-container",
}) => {
  return <div className={`${className} p-4 lg:gap-2 lg:p-6`}>{children}</div>;
};

export default PageContainer;
