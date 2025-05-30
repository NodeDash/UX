import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface TranslationDebuggerProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

const TranslationDebugger: React.FC<TranslationDebuggerProps> = ({
  position = "bottom-right",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    missingTranslationKeys,
    clearMissingKeys,
    exportMissingKeys,
    language,
  } = useLanguage();

  // Group by language for better visualization
  const missingKeysByLanguage: Record<string, string[]> = {};

  missingTranslationKeys.forEach((keyId) => {
    const [lang, , key] = keyId.split(":");
    if (!missingKeysByLanguage[lang]) missingKeysByLanguage[lang] = [];
    if (!missingKeysByLanguage[lang].includes(key)) {
      missingKeysByLanguage[lang].push(key);
    }
  });

  // Only show in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setIsVisible(true);
    }
  }, []);

  // Position styling
  const positionStyles: Record<string, React.CSSProperties> = {
    "bottom-right": { bottom: "20px", right: "20px" },
    "bottom-left": { bottom: "20px", left: "20px" },
    "top-right": { top: "20px", right: "20px" },
    "top-left": { top: "20px", left: "20px" },
  };

  // If not visible or no missing keys, don't render
  if (!isVisible || missingTranslationKeys.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        maxWidth: isExpanded ? "600px" : "200px",
        maxHeight: isExpanded ? "80vh" : "40px",
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        color: "#fff",
        borderRadius: "6px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        ...positionStyles[position],
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "8px 12px",
          backgroundColor: "#ff5722",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ fontWeight: "bold" }}>
          {isExpanded
            ? "Translation Issues"
            : `Missing Keys: ${missingTranslationKeys.length}`}
        </div>
        <div>{isExpanded ? "▼" : "▲"}</div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div
          style={{
            padding: "12px",
            overflowY: "auto",
            maxHeight: "calc(80vh - 40px)",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <div>
              Current language: <strong>{language}</strong>
            </div>
            <div>
              Total missing keys:{" "}
              <strong>{missingTranslationKeys.length}</strong>
            </div>
          </div>

          {Object.entries(missingKeysByLanguage).map(([lang, keys]) => (
            <div key={lang} style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "bold",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              >
                {lang} ({keys.length} keys)
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 20px" }}>
                {keys.map((key) => (
                  <li
                    key={key}
                    style={{
                      marginBottom: "4px",
                      fontFamily: "monospace",
                      fontSize: "13px",
                    }}
                  >
                    {key}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button
              onClick={clearMissingKeys}
              style={{
                backgroundColor: "#2962ff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
            <button
              onClick={exportMissingKeys}
              style={{
                backgroundColor: "#00c853",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Export to Console
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationDebugger;
