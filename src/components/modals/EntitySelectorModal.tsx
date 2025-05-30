import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../ui";
import ModalFooter from "./ModalFooter";
import { useEntitySelectorModal } from "@/hooks/query/modals/useEntitySelectorModal";

interface EntitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  entities: any[];
  title: string;
  onSelect: (entity: any) => void;
  existingEntityIds?: string[]; // Add this prop to track existing entities
}

const EntitySelectorModal: React.FC<EntitySelectorModalProps> = ({
  isOpen,
  onClose,
  entities,
  title,
  onSelect,
  existingEntityIds = [], // Default to empty array
}) => {
  const { t } = useTranslation();

  // Use our custom hook
  const {
    searchQuery,
    setSearchQuery,
    filteredEntities,
    isEntityInFlow,
    handleSelectEntity,
    isDarkMode,
  } = useEntitySelectorModal({
    entities,
    existingEntityIds,
    onSelect,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <ModalFooter onCancel={onClose} cancelText={t("common.cancel")} />
      }
    >
      <div className="p-4">
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
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
            </div>
            <input
              type="text"
              placeholder={t("common.search")}
              className={`w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-2 max-h-60 overflow-y-auto">
          {filteredEntities.length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mb-2"
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
              <p>{t("common.noResults")}</p>
            </div>
          ) : (
            <ul
              className={`divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {filteredEntities.map((entity) => {
                const alreadyExists = isEntityInFlow(entity.id);
                return (
                  <li
                    key={entity.id}
                    className={`py-3 px-3 rounded-md transition ${
                      alreadyExists
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    } ${
                      isDarkMode
                        ? alreadyExists
                          ? "bg-gray-800"
                          : "hover:bg-gray-700"
                        : alreadyExists
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelectEntity(entity)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-md mr-3 ${
                            isDarkMode ? "bg-blue-900" : "bg-blue-50"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              isDarkMode ? "text-blue-300" : "text-blue-500"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {entity.name}
                          </p>
                          {entity.description && (
                            <p
                              className={`text-xs truncate max-w-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {entity.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {alreadyExists && (
                        <span
                          className={`px-2 py-1 text-xs rounded-md ${
                            isDarkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          Already in flow
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EntitySelectorModal;
