/**
 * Utility to check translation files for missing keys
 * This can be run as a standalone script or imported in tests
 */

import * as fs from 'fs';
import * as path from 'path';

// Define the location of translation files
const TRANSLATIONS_DIR = path.resolve(__dirname, '..', 'locales');
const REFERENCE_LOCALE = 'en';

interface TranslationReport {
  locale: string;
  missingKeys: string[];
  extraKeys: string[];
  status: 'complete' | 'incomplete';
}

/**
 * Gets all keys from a nested object with dot notation
 * @param obj - The object to extract keys from
 * @param prefix - The prefix for nested keys
 * @returns Array of keys in dot notation
 */
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.keys(obj).reduce((keys: string[], key) => {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return [...keys, ...getAllKeys(obj[key] as Record<string, unknown>, currentKey)];
    }
    return [...keys, currentKey];
  }, []);
}

/**
 * Checks if a key exists in an object using dot notation
 * @param obj - The object to check
 * @param key - The key in dot notation to check for
 * @returns Boolean indicating if the key exists
 */
function hasKey(obj: Record<string, unknown>, key: string): boolean {
  const parts = key.split('.');
  let current = obj as Record<string, unknown>;
  
  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      return false;
    }
    current = current[part] as Record<string, unknown>;
  }
  
  return true;
}

/**
 * Validates translation files against the reference locale
 * @returns An array of reports for each locale
 */
export function validateTranslations(): TranslationReport[] {
  try {
    // Read all locale directories
    const locales = fs.readdirSync(TRANSLATIONS_DIR)
                      .filter(file => fs.statSync(path.join(TRANSLATIONS_DIR, file)).isDirectory());
    
    // Read the reference locale (English) translation file
    const referenceFilePath = path.join(TRANSLATIONS_DIR, REFERENCE_LOCALE, 'translation.json');
    const referenceContent = fs.readFileSync(referenceFilePath, 'utf8');
    const referenceData = JSON.parse(referenceContent);
    const referenceKeys = getAllKeys(referenceData);
    
    // Compare each locale with the reference
    const reports: TranslationReport[] = [];
    
    for (const locale of locales) {
      if (locale === REFERENCE_LOCALE) continue;
      
      const translationFilePath = path.join(TRANSLATIONS_DIR, locale, 'translation.json');
      
      try {
        const translationContent = fs.readFileSync(translationFilePath, 'utf8');
        const translationData = JSON.parse(translationContent);
        const translationKeys = getAllKeys(translationData);
        
        // Find missing keys (in reference but not in translation)
        const missingKeys = referenceKeys.filter(key => !hasKey(translationData, key));
        
        // Find extra keys (in translation but not in reference)
        const extraKeys = translationKeys.filter(key => !hasKey(referenceData, key));
        
        reports.push({
          locale,
          missingKeys,
          extraKeys,
          status: missingKeys.length === 0 ? 'complete' : 'incomplete'
        });
      } catch (err) {
        console.error(`Error loading translation for locale ${locale}:`, err);
        reports.push({
          locale,
          missingKeys: ['Error reading translation file'],
          extraKeys: [],
          status: 'incomplete'
        });
      }
    }
    
    return reports;
  } catch (err) {
    console.error('Error validating translations:', err);
    throw err;
  }
}

/**
 * Prints the validation report to the console
 */
export function printValidationReport(): void {
  const reports = validateTranslations();
  
  console.log('\n=== Translation Validation Report ===\n');
  
  for (const report of reports) {
    console.log(`Locale: ${report.locale}`);
    console.log(`Status: ${report.status === 'complete' ? '✅ Complete' : '❌ Incomplete'}`);
    
    if (report.missingKeys.length > 0) {
      console.log(`Missing keys (${report.missingKeys.length}):`);
      report.missingKeys.forEach(key => console.log(`  - ${key}`));
    } else {
      console.log('No missing keys! 🎉');
    }
    
    if (report.extraKeys.length > 0) {
      console.log(`\nExtra keys (${report.extraKeys.length}):`);
      report.extraKeys.forEach(key => console.log(`  - ${key}`));
    }
    
    console.log('\n---\n');
  }
}

// Run the validation if this file is executed directly
if (require.main === module) {
  printValidationReport();
}
