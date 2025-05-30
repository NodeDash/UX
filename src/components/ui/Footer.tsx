import React from "react";
import { useTheme } from "@/context/ThemeContext";
import VersionDisplay from "./VersionDisplay";

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <footer
      className={`py-4 px-6 border-t mt-auto  ${
        isDarkMode
          ? "border-gray-800 text-gray-400"
          : "border-gray-100 text-gray-500"
      }`}
    >
      <div className="mx-auto flex justify-between ">
        <VersionDisplay />
      </div>
    </footer>
  );
};

export default Footer;
