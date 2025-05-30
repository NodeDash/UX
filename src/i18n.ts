import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';
import deTranslation from './locales/de/translation.json';

// Configure i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      },
      fr: {
        translation: frTranslation
      },
      de: {
        translation: deTranslation
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    // Enhanced missing key detection
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`MISSING TRANSLATION KEY: "${key}" for language: ${lng}, namespace: ${ns}`);
    },
    appendNamespaceToCIMode: true
  });

// Track all missing keys in development
const missingKeys = new Set<string>();

if (process.env.NODE_ENV === 'development') {
  i18n.on('missingKey', (lngs, namespace, key) => {
    const keyId = `${lngs[0]}:${namespace}:${key}`;
    if (!missingKeys.has(keyId)) {
      missingKeys.add(keyId);
      console.warn(`Missing translation key found: "${key}" for language "${lngs[0]}" in namespace "${namespace}"`);
    }
  });
}

export default i18n;
export { missingKeys };