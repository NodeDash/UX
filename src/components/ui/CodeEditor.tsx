import React from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/context/ThemeContext";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
}

/**
 * A code editor component that uses Monaco Editor
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = "javascript",
  height = "400px",
  readOnly = false,
}) => {
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const { theme } = useTheme();
  const editorTheme = theme === "dark" ? "vs-dark" : "light";

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      theme={editorTheme}
      onChange={handleEditorChange}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        readOnly,
        wordWrap: "on",
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
