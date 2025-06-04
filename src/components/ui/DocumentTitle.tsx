import { useEffect } from "react";
import { config } from "@/services/config.service";

interface DocumentTitleProps {
  title?: string;
}

/**
 * Component that manages the document title
 * It will append the page title to the application name with environment indicators
 */
export const DocumentTitle: React.FC<DocumentTitleProps> = ({ title }) => {
  useEffect(() => {
    const baseTitle = config.getDocumentTitle();
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    return () => {
      // Reset to base title when component unmounts
      document.title = baseTitle;
    };
  }, [title]);

  // This is a utility component with no UI
  return null;
};

export default DocumentTitle;
