import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./input";
import { searchService, SearchResult } from "../../services/search.service";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  useDevices,
  useFlows,
  useFunctions,
  useIntegrations,
  useLabels,
} from "@/hooks/api";
import { useIsMobile } from "@/hooks/ux/use-mobile";
import { Button } from "./button";

/**
 * Props interface for the SearchBar component
 */
interface SearchBarProps {
  /** Optional CSS class name to apply to the search bar container */
  className?: string;
  /** Force mobile mode for the search bar (overrides automatic detection) */
  isMobile?: boolean;
}

/**
 * A search bar component that provides real-time search functionality across the application.
 * Displays search results in a dropdown and navigates to the selected result when clicked.
 * On mobile, shows a search icon button that opens a modal with the search input.
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Optional CSS class to apply to the container
 * @param {boolean} [props.isMobile] - Force mobile mode for the search bar
 * @returns {JSX.Element} A search input with dropdown results or search icon button on mobile
 */
const SearchBar: React.FC<SearchBarProps> = ({
  className,
  isMobile: forceMobile,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const autoDetectedMobile = useIsMobile();

  // Use forced value if provided, otherwise use autodetected value
  const isMobile = forceMobile !== undefined ? forceMobile : autoDetectedMobile;

  const { t } = useTranslation();

  // Get data from React Query hooks
  const { data: devices = [] } = useDevices();
  const { data: flows = [] } = useFlows();
  const { data: functions = [] } = useFunctions();
  const { data: integrations = [] } = useIntegrations();
  const { data: labels = [] } = useLabels();

  useEffect(() => {
    /**
     * Performs a search query with debouncing and updates the results state.
     * Clears results if the query is empty.
     */
    const handleSearch = async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // Use local data for search
        const searchResults = await searchService.search(query, {
          devices,
          flows,
          functions,
          integrations,
          labels,
        });
        setResults(searchResults);
      } catch (error) {
        console.error(t("common.searchError"), error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, devices, flows, functions, integrations, labels, t]);

  useEffect(() => {
    /**
     * Handles clicks outside the search component to hide the results dropdown.
     * @param {MouseEvent} event - The mouse event
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle ESC key to close the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  /**
   * Handles a change in the search input field.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.trim().length > 0);
  };

  /**
   * Handles a click on a search result item.
   * Navigates to the result URL and resets the search state.
   *
   * @param {SearchResult} result - The selected search result
   */
  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setQuery("");
    setShowResults(false);
    setIsModalOpen(false);
  };

  /**
   * Opens the search modal for mobile view
   */
  const openSearchModal = () => {
    setIsModalOpen(true);
    // Focus the search input after a short delay
    setTimeout(() => {
      const inputElement = document.getElementById("mobile-search-input");
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  };

  /**
   * Returns the appropriate icon SVG based on the result type.
   *
   * @param {string} type - The type of search result (device, flow, function, etc.)
   * @returns {JSX.Element|null} The SVG icon element or null if type is not recognized
   */
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "device":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
        );
      case "flow":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      case "function":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        );
      case "integration":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        );
      case "label":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Mobile search button with modal
  if (isMobile) {
    return (
      <>
        <Button onClick={openSearchModal} aria-label={t("common.search")}>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </Button>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              ref={modalRef}
              className="w-full max-w-md mx-4 bg-background rounded-lg shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <Input
                    id="mobile-search-input"
                    type="text"
                    placeholder={t("common.search")}
                    className="pl-10 pr-10 w-full"
                    value={query}
                    onChange={handleSearchChange}
                    autoFocus
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 text-muted-foreground hover:text-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {query.trim() !== "" && (
                  <div className="mt-2 bg-background border rounded-md shadow-lg overflow-hidden">
                    {isLoading ? (
                      <div className="p-3 text-center text-muted-foreground">
                        <div className="inline-block w-5 h-5 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                        {t("common.loading")}
                      </div>
                    ) : results.length > 0 ? (
                      <ul className="max-h-80 overflow-auto">
                        {results.map((result) => (
                          <li
                            key={`${result.type}-${result.id}`}
                            className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-2 border-b border-border last:border-0"
                            onClick={() => handleResultClick(result)}
                          >
                            <span className="text-muted-foreground">
                              {getTypeIcon(result.type)}
                            </span>
                            <span>{result.name}</span>
                            <span className="ml-auto text-xs text-muted-foreground capitalize">
                              {result.type}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-3 text-center text-muted-foreground">
                        {t("common.noResults")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop search input with dropdown
  return (
    <div className={cn("relative", className)} ref={searchRef}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          type="text"
          placeholder={t("common.search")}
          className="pl-10 w-full md:w-64"
          value={query}
          onChange={handleSearchChange}
          onFocus={() => setShowResults(query.trim() !== "")}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {results.map((result) => (
              <li
                key={`${result.type}-${result.id}`}
                className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                onClick={() => handleResultClick(result)}
              >
                <span className="text-muted-foreground">
                  {getTypeIcon(result.type)}
                </span>
                <span>{result.name}</span>
                <span className="ml-auto text-xs text-muted-foreground capitalize">
                  {result.type}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
