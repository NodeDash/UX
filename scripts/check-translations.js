import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the location of translation files
const TRANSLATIONS_DIR = path.resolve(__dirname, "..", "src", "locales");
const REFERENCE_LOCALE = "en";

/**
 * Gets all keys from a nested object with dot notation
 * @param {Object} obj - The object to extract keys from
 * @param {string} prefix - The prefix for nested keys
 * @returns {Array<string>} Array of keys in dot notation
 */
function getAllKeys(obj, prefix = "") {
  return Object.keys(obj).reduce((keys, key) => {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      return [...keys, ...getAllKeys(obj[key], currentKey)];
    }
    return [...keys, currentKey];
  }, []);
}

/**
 * Checks if a key exists in an object using dot notation
 * @param {Object} obj - The object to check
 * @param {string} key - The key in dot notation to check for
 * @returns {boolean} Boolean indicating if the key exists
 */
function hasKey(obj, key) {
  const parts = key.split(".");
  let current = obj;

  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return false;
    }
    current = current[part];
  }

  return true;
}

/**
 * Validates translation files against the reference locale
 * @returns {Array<Object>} An array of reports for each locale
 */
function validateTranslations() {
  try {
    // Read all locale directories
    const locales = fs
      .readdirSync(TRANSLATIONS_DIR)
      .filter((file) =>
        fs.statSync(path.join(TRANSLATIONS_DIR, file)).isDirectory()
      );

    // Read the reference locale (English) translation file
    const referenceFilePath = path.join(
      TRANSLATIONS_DIR,
      REFERENCE_LOCALE,
      "translation.json"
    );
    const referenceContent = fs.readFileSync(referenceFilePath, "utf8");
    const referenceData = JSON.parse(referenceContent);
    const referenceKeys = getAllKeys(referenceData);

    // Compare each locale with the reference
    const reports = [];

    for (const locale of locales) {
      if (locale === REFERENCE_LOCALE) continue;

      const translationFilePath = path.join(
        TRANSLATIONS_DIR,
        locale,
        "translation.json"
      );

      try {
        const translationContent = fs.readFileSync(translationFilePath, "utf8");
        const translationData = JSON.parse(translationContent);
        const translationKeys = getAllKeys(translationData);

        // Find missing keys (in reference but not in translation)
        const missingKeys = referenceKeys.filter(
          (key) => !hasKey(translationData, key)
        );

        // Find extra keys (in translation but not in reference)
        const extraKeys = translationKeys.filter(
          (key) => !hasKey(referenceData, key)
        );

        reports.push({
          locale,
          missingKeys,
          extraKeys,
          status: missingKeys.length === 0 ? "complete" : "incomplete",
        });
      } catch (err) {
        console.error(`Error loading translation for locale ${locale}:`, err);
        reports.push({
          locale,
          missingKeys: ["Error reading translation file"],
          extraKeys: [],
          status: "incomplete",
        });
      }
    }

    return reports;
  } catch (err) {
    console.error("Error validating translations:", err);
    throw err;
  }
}

/**
 * Prints the validation report to the console
 */
function printValidationReport() {
  const reports = validateTranslations();

  console.log("\n=== Translation Validation Report ===\n");

  for (const report of reports) {
    console.log(`Locale: ${report.locale}`);
    console.log(
      `Status: ${
        report.status === "complete" ? "✅ Complete" : "❌ Incomplete"
      }`
    );

    if (report.missingKeys.length > 0) {
      console.log(`Missing keys (${report.missingKeys.length}):`);
      report.missingKeys.forEach((key) => console.log(`  - ${key}`));
    } else {
      console.log("No missing keys! 🎉");
    }

    if (report.extraKeys.length > 0) {
      console.log(`\nExtra keys (${report.extraKeys.length}):`);
      report.extraKeys.forEach((key) => console.log(`  - ${key}`));
    }

    console.log("\n---\n");
  }
}

// Run the validation
printValidationReport();
