import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SearchResult } from "../../services/search.service";
import { useLocalSearch } from "@/hooks/ux/useLocalSearch";

const SearchBox: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Use our new local search hook
  const { results, isLoading } = useLocalSearch(query);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.trim().length > 0);
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setIsOpen(false);
    setQuery("");
  };

  // Determine type-specific icon
  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "device":
        return "🔌";
      case "flow":
        return "📊";
      case "function":
        return "⚙️";
      case "integration":
        return "🔄";
      case "label":
        return "🏷️";
      default:
        return "📄";
    }
  };

  return (
    <div className="relative" ref={searchBoxRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={t("common.search")}
          className="w-full p-2 pl-10 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={handleSearchChange}
          onFocus={() => query.trim() && setIsOpen(true)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 overflow-hidden">
          {isLoading ? (
            <div className="p-3 text-center text-gray-400">
              {t("common.loading")}
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li
                  key={`${result.type}-${result.id}`}
                  className="p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{getTypeIcon(result.type)}</span>
                    <div>
                      <div className="text-white">{result.name}</div>
                      <div className="text-xs text-gray-400">
                        {t(`common.${result.type}`)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center text-gray-400">
              {t("common.noResults")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
