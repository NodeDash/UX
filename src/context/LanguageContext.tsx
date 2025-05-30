import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import i18n from "../i18n";
import { missingKeys } from "../i18n";

type Language = "en" | "es" | "fr" | "de";

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  availableLanguages: { code: Language; name: string }[];
  missingTranslationKeys: string[];
  clearMissingKeys: () => void;
  exportMissingKeys: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage as Language) || "en";
  });

  // Add state to track missing keys
  const [missingTranslationKeys, setMissingTranslationKeys] = useState<
    string[]
  >([]);

  const availableLanguages = [
    { code: "en" as Language, name: "English" },
    { code: "es" as Language, name: "Español" },
    { code: "fr" as Language, name: "Français" },
    { code: "de" as Language, name: "Deutsch" },
  ];

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  // Clear missing keys function
  const clearMissingKeys = () => {
    missingKeys.clear();
    setMissingTranslationKeys([]);
  };

  // Export missing keys to console/file
  const exportMissingKeys = () => {
    // Group by language
    const keysByLanguage: Record<string, string[]> = {};

    missingTranslationKeys.forEach((keyId) => {
      const [lang, , key] = keyId.split(":");
      if (!keysByLanguage[lang]) keysByLanguage[lang] = [];
      keysByLanguage[lang].push(key);
    });

    console.log("==== Missing Translation Keys ====");
    Object.entries(keysByLanguage).forEach(([lang, keys]) => {
      console.log(
        `\nLanguage: ${lang}\nMissing keys (${keys.length}):\n  - ${keys.join(
          "\n  - "
        )}`
      );
    });

    // Allow copying to clipboard
    const exportData = JSON.stringify(keysByLanguage, null, 2);
    console.log("\nCopy the JSON below to create translation files:");
    console.log(exportData);
  };

  useEffect(() => {
    // Initialize language based on stored preference
    i18n.changeLanguage(language);

    // Set up listener for missing keys updates
    const checkForMissingKeys = () => {
      if (missingKeys.size > 0) {
        setMissingTranslationKeys(Array.from(missingKeys));
      }
    };

    // Check periodically for new missing keys
    const intervalId = setInterval(checkForMissingKeys, 2000);

    return () => clearInterval(intervalId);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        availableLanguages,
        missingTranslationKeys,
        clearMissingKeys,
        exportMissingKeys,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
